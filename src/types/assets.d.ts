/**
 * This file provides declarations for importing assets using the metro bundler. The return is a number,
 * which is the reference to the asset in the bundle.
 *
 * See https://github.com/facebook/metro/blob/main/packages/metro-config/src/defaults/defaults.js#L14-L44
 * for the list of default asset extensions for Metro.
 */
// Image formats
declare module '*.bmp' {
  export default number;
}
declare module '*.gif' {
  export default number;
}
declare module '*.jpg' {
  export default number;
}
declare module '*.jpeg' {
  export default number;
}
declare module '*.png' {
  export default number;
}
declare module '*.psd' {
  export default number;
}
declare module '*.svg' {
  export default number;
}
declare module '*.webp' {
  export default number;
}

// Video formats
declare module '*.m4v' {
  export default number;
}
declare module '*.mov' {
  export default number;
}
declare module '*.mp4' {
  export default number;
}
declare module '*.mpeg' {
  export default number;
}
declare module '*.mpg' {
  export default number;
}
declare module '*.webm' {
  export default number;
}

// Audio formats
declare module '*.aac' {
  export default number;
}
declare module '*.aiff' {
  export default number;
}
declare module '*.caf' {
  export default number;
}
declare module '*.m4a' {
  export default number;
}
declare module '*.mp3' {
  export default number;
}
declare module '*.wav' {
  export default number;
}

// Document formats
declare module '*.html' {
  export default number;
}
declare module '*.pdf' {
  export default number;
}
declare module '*.yaml' {
  export default number;
}
declare module '*.yml' {
  export default number;
}
// Font formats
declare module '*.otf' {
  export default number;
}
declare module '*.ttf' {
  export default number;
}

// Archives (virtual files)
declare module '*.zip' {
  export default number;
}
