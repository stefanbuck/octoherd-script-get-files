// @ts-check

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
export async function script(
  octokit,
  repository,
  { ignoreArchived, source, target }
) {}
