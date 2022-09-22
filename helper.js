import os from 'os'
import fs from 'fs'
import path from 'path'
import minimatch from "minimatch"

export async function downloadFile(octokit, repository, target, source) {
  const filepath = [repository.owner.login, repository.name, source].join('/');

  return octokit.request(
    `GET /repos/{owner}/{repo}/contents/${source}`,
    {
      owner: repository.owner.login,
      repo: repository.name,
      headers: {
        Accept: "application/vnd.github.v3.raw"
      }
    }
  ).then((res) => {
    octokit.log.info(`Download ${filepath}`);

    // Expand the ~ character to a users home directory
    const newTarget = target.replace("~", os.homedir)

    const targetFile = path.join(newTarget, repository.owner.login, repository.name, source);
    const targetPath = path.join(newTarget, repository.owner.login, repository.name, path.dirname(source));

    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    fs.writeFileSync(targetFile, res.data)
  }).catch(error => {
    if (error.status === 404) {
      octokit.log.warn(`File ${filepath} not found`);
      return false;
    }

    throw error;
  })
}

export async function getListOfFilesToDownload(octokit, repository, source) {
  const res = await octokit.request(
    `GET /repos/{owner}/{repo}/git/trees/HEAD?recursive=true`,
    {
      owner: repository.owner.login,
      repo: repository.name,
      headers: {
        Accept: "application/vnd.github.v3.raw"
      }
    }).catch(error => {
      if (error.status === 409) {
        octokit.log.warn(`Git Repository is empty`);
        return { data: { tree: [] } };
      }

      throw error;
    })

  const tree = res?.data?.tree?.filter(item => item.type === 'blob').map(item => item.path);

  return tree.filter(item => minimatch(item, source))
}
