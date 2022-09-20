// @ts-check

import os from 'os'
import fs from 'fs'
import path from 'path'

/** @type boolean */
let hasRepoScope;

/**
 * An Octoherd script to download files from repositories
 *
 * @param {import('@octoherd/cli').Octokit} octokit
 * @param {import('@octoherd/cli').Repository} repository
 * @param {object} options
 * @param {boolean} [options.ignoreArchived] Ignores archive repositories
 * @param {string} options.source Path to the destination directory
 * @param {string} options.target File path to download. Note: Directories are not supported yet
 */
export async function script(octokit, repository, { source, target = process.cwd(), ignoreArchived = true }) {
  if (!hasRepoScope) {
    const { headers } = await octokit.request("HEAD /");
    const scopes = new Set(headers["x-oauth-scopes"].split(", "));

    if (!scopes.has("repo")) {
      throw new Error(
        `The "repo" scope is required for this script. Create a token at https://github.com/settings/tokens/new?scopes=repo then run the script with "-T <paste token here>"`
      );
    }
    hasRepoScope = true;
  }

  if (ignoreArchived && repository.archived) {
    octokit.log.warn(`IGNORE repository is archived`);
    return;
  }

  if (!source) {
    octokit.log.error('Please specify a source file to download with --source=README.md')
    process.exit(1);
  }

  if (!target) {
    octokit.log.error('Please specify a source file to download with --source=README.md --target=./out')
    process.exit(1);
  }

  await octokit.request(
    `GET /repos/{owner}/{repo}/contents/${source}`,
    {
      owner: repository.owner.login,
      repo: repository.name,
      headers: {
        Accept: "application/vnd.github.v3.raw"
      }
    }
  ).then((res) => {
    octokit.log.info(`Download ${source}`);

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
      octokit.log.warn(`File ${source} not found`);
      return false;
    }

    throw error;
  })
}
