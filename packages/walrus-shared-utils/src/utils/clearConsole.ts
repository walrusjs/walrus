import { cursorTo, clearScreenDown } from 'readline';

/**
 * 清空控制台
 * @param title
 */
function clearConsole(
  title?: string
) {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    cursorTo(process.stdout, 0, 0);
    clearScreenDown(process.stdout);
    if (title) {
      console.log(title)
    }
  }
}

export default clearConsole;
