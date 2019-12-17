# Install SPIG

`Spig` is a framework, and it is not designed to work out-of-box.

## 1. Installation

+ [Download this repo](https://github.com/igr/spig/archive/master.zip)
+ Copy the `/spig` folder to your project.
+ Create `src` folder as in the example
+ Add dependency to `package.json`:
```json
{
  "dependencies": {
    "spig": "file:./spig"
  }
}
```
+ Run `yarn install`
+ Add `gulpfile.js` and start using **Spig**.


## 2. Updates

For **Spig** updates, just update the `/spig` folder and run `yarn install`. Sometimes you might need to reset the node, so use provided `spig-reset.sh`.
