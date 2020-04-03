import color from 'color';

const ratio = 0.618033988749895;
let hue = Math.random();

/**
 * 获取随机的颜色
 */
export default function (saturation: number = 0.5, value: number = 0.95) {
  hue += ratio;
  hue %= 1;

  return color({
    h: hue * 360,
    s: saturation * 100,
    v: value * 100
  });
}
