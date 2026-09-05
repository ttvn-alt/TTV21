import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const dir = process.cwd();

async function initAndCommit() {
  console.log('Initializing local git repository...');
  await git.init({ fs, dir });

  console.log('Adding files...');
  const files = [
    'index.html',
    'package.json',
    'vite.config.js',
    'src/App.jsx',
    'src/index.css',
    'src/main.jsx',
    'public/avatar.png',
    'README.md'
  ];

  for (const filepath of files) {
    if (fs.existsSync(path.join(dir, filepath))) {
      await git.add({ fs, dir, filepath });
      console.log(`Staged: ${filepath}`);
    }
  }

  console.log('Creating commit...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Antigravity AI',
      email: 'antigravity@gemini.ai',
    },
    message: 'Initial commit: TikTok Coins Exchange mobile app'
  });

  console.log(`Commit created successfully! SHA: ${sha}`);
}

initAndCommit().catch(err => {
  console.error('Error in git init/commit:', err);
});
