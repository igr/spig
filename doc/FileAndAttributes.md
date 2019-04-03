# File and attributes [WIP]

Files in `Spig` are simple JSON object that has the following keys:


+ `src`: absolutePath,
+ `name`: name from the site root without the extension
+ `path`: path
+ `out`: the output path
+ `dir`: directory name
+ `contents`: file content as `Buffer`
+ `attr`: file attributes (defined e.g. in frontmatter).

`Spig` operations may add custom keys and change values (like the `out` name).
