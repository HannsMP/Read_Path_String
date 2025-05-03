const { writeFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

let mainPath = 'C:\\Users\\darkcry\\Documents\\Nodejs\\Git\\Sistema_Ventas_REHF';
let ignores = new Set([
  'C:\\Users\\darkcry\\Documents\\Nodejs\\Git\\Sistema_Ventas_REHF\\.git',
  'C:\\Users\\darkcry\\Documents\\Nodejs\\Git\\Sistema_Ventas_REHF\\node_modules',
  'C:\\Users\\darkcry\\Documents\\Nodejs\\Git\\Sistema_Ventas_REHF\\.cache\\wwebjs',
  'C:\\Users\\darkcry\\Documents\\Nodejs\\Git\\Sistema_Ventas_REHF\\.cache\\session'
])

let lines = [];

/** 
 * @type {{
 *   showFiles: boolean | 'list' | 'count'
 * }} 
 */
let option = {
  showFiles: false
}

function currentPath(path = mainPath, level = -1) {
  let dir = readdirSync(path);

  let dirParse = dir.map(d => {
    let pathCurrent = join(path, d);
    let stats = statSync(pathCurrent);

    return {
      base: d,
      path: pathCurrent,
      isDirectory: stats.isDirectory()
    }
  })
    .filter(d => !ignores.has(d.path))

  let justDirectory = dirParse.filter(d => d.isDirectory);
  let justFile = dirParse.filter(d => !d.isDirectory);

  justDirectory.forEach((d, i) => {
    let tab = level > -1
      ? '┃ '.repeat(level + 1) + '┣ '
      : '';

    lines.push(tab + `📂 ${d.base}`);
    currentPath(d.path, level + 1)
  })

  if (option.showFiles == 'list') {
    let tab = level > -1
      ? '┃ '.repeat(level + 1)
      : '';

    lines.push(tab + `┗ 📜 ${justFile.map(d => d.base).join(', ')}`);
  }
  if (option.showFiles == 'count') {
    let tab = level > -1
      ? '┃ '.repeat(level + 1)
      : '';

    if (justFile.length) lines.push(tab + `┗ 📜 ${justFile.length}`);
  }
  else if (option.showFiles)
    justFile.forEach((d, i) => {
      let tab = level > -1
        ? '┃ '.repeat(level + 1)
        : '';

      if (i != dirParse.length - 1)
        lines.push(tab + `┣ 📜 ${d.base}`);
      else
        lines.push(tab + `┗ 📜 ${d.base}`);
    })
  return
}

currentPath();
writeFileSync('./result.txt', lines.join('\n'));
