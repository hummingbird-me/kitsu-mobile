const BASE83_CHARS =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~'.split(
    ''
  );

const decode83 = (str: string) => {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const digit = BASE83_CHARS.indexOf(c);
    value = value * 83 + digit;
  }
  return value;
};

const sRGBToLinear = (value: number) => {
  const v = value / 255;
  if (v <= 0.04045) {
    return v / 12.92;
  } else {
    return Math.pow((v + 0.055) / 1.055, 2.4);
  }
};

const signPow = (base: number, exp: number) =>
  Math.sign(base) * Math.pow(Math.abs(base), exp);

const decodeDC = (value: number) => {
  const intR = value >> 16;
  const intG = (value >> 8) & 255;
  const intB = value & 255;
  return [sRGBToLinear(intR), sRGBToLinear(intG), sRGBToLinear(intB)];
};

const decodeAC = (value: number, maximumValue: number) => {
  const quantR = Math.floor(value / (19 * 19));
  const quantG = Math.floor(value / 19) % 19;
  const quantB = value % 19;

  const rgb = [
    signPow((quantR - 9) / 9, 2.0) * maximumValue,
    signPow((quantG - 9) / 9, 2.0) * maximumValue,
    signPow((quantB - 9) / 9, 2.0) * maximumValue,
  ];

  return rgb;
};

export default function decodeBlurhash(blurhash: string, punch = 1) {
  const sizeFlag = decode83(blurhash[0]);
  const numY = Math.floor(sizeFlag / 9) + 1;
  const numX = (sizeFlag % 9) + 1;

  const quantisedMaximumValue = decode83(blurhash[1]);
  const maximumValue = (quantisedMaximumValue + 1) / 166;

  const colors = new Float32Array(numX * numY * 3);

  for (let i = 0; i < numX * numY; i++) {
    if (i === 0) {
      const value = decode83(blurhash.substring(2, 6));
      colors.set(decodeDC(value), i * 3);
    } else {
      const value = decode83(blurhash.substring(4 + i * 2, 6 + i * 2));
      const color = decodeAC(value, maximumValue * punch);
      colors.set(color, i * 3);
    }
  }

  return {
    colors,
    numX,
    numY,
  };
}

export const getAverageColor = (blurhash: string): [number, number, number] => {
  const value = decode83(blurhash.substring(2, 6));
  const intR = value >> 16;
  const intG = (value >> 8) & 255;
  const intB = value & 255;
  return [intR, intG, intB];
};
