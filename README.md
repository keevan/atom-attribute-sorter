# Sorts attributes based on defaults or user defined order

This sorts attributes on a HTML element in the order defined (otherwise it does
not change the order).

*THIS CURRENTLY WORKS BASED ON CURRENT SELECTION*

## Animated Examples

![Small example](https://user-images.githubusercontent.com/9924643/57016054-67c07280-6c5b-11e9-9bd1-043e267015ce.gif)

## Notes about behaviour

Since most of this was functionality that existed via another package, one of
the behaviours I did notice was that it was clearing attributes that had empty
values.

This might be a great thing, but for some doc types such as XHTML, this might be
a no-no, or if you happen to work for Google and the standard is to set img alt
attributes with an empty string (alt="")

Also another thing I noticed was if you selected just the opening tag, it
creates the closing tag

More examples of things I want in the TODO file

## Reasons behind the package

Made the package because I couldn't find it myself on Atom, but most of the
functionality was already out there in other editors.

Because I rushed this just to get the behaviour I wanted for work, I didn't
clean up the this readme, so I do apologize in advanced.

## Default sort order

```javascript

var defaultSortOrder = [
	// TAL order of priority
		'tal:define',
		'tal:condition',
		'tal:repeat',
		'tal:content',
		'tal:replace',
		'tal:attributes',
		'tal:omit-tag',
		'tal:.+',
	// Prefered order of attributes
		'id',
		'name',
		'class',
		'data-.+',
	// Vue specific
		'v-.+',
		'@.+',
		':.+',
	// Other
		'src',
		'for',
		'type',
		'href',
		'values',
		'title',
		'placeholder',
		'alt',
		'role',
		'aria-.+',
		'style',
		'$unknown$'
];

```


## Keyboard shortcuts

For changes keyboard shortcuts, open the your application snippets and create a new rule. Disable these default keymaps if they don't suit you.

```cson
{
  "atom-text-editor.vim-mode-plus:not(.insert-mode)": {
    "space i t": "atom-attribute-sorter:sort"
  },
  "atom-text-editor:not(.vim-mode-plus)": {
    "ctrl-k t": "atom-attribute-sorter:sort"
  }
}
```

## License

This software is released under the terms of the MIT license.
