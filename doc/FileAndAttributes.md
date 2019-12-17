# File and attributes [WIP]

Files in **Spig** are simple JSON object that has the following keys:

+ `id`: source path without extension, read-only; used for lookup
+ `src`: absolute path on file system of the host,
+ `name`: name from the site root without the extension
+ `path`: path
+ `out`: the output path
+ `dir`: directory name
+ `contents`: file content as `Buffer` or `string`
+ `attr`: file attributes (defined e.g. in frontmatter).

(All `path`s are defined from the source root)


**Spig** operations may add custom keys and change values (like the `out` name).
