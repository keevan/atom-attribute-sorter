'use babel';

import AtomAttributeSorterView from './atom-attribute-sorter-view';
import { CompositeDisposable } from 'atom';

import posthtml from 'posthtml';
import attrsSorter from 'posthtml-attrs-sorter';

export default {
	// User configurations
	config: {
	  "preferredAttributeOrder": {
	    "description": "Please enter the list of attributes in your preferred order - supports regex (values not provided will not be sorted)",
	    "type": "string",
	    "default": ""
	  }
	},
	// Atom Package Generator Defaults
  atomAttributeSorterView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomAttributeSorterView = new AtomAttributeSorterView(state.atomAttributeSorterViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomAttributeSorterView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-attribute-sorter:sort': () => this.sort()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomAttributeSorterView.destroy();
  },

  serialize() {
    return {
      atomAttributeSorterViewState: this.atomAttributeSorterView.serialize()
    };
  },

  sort() {
		let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()

			// Example:
			/*
				<tal:block tal:define="something" tal:condition="false" tal:repeat="loop loops" id="dsapdsaoijd" class="sada" data-something disable>

					<!-- Some indentation -->
						<div>Cool element</div>
				</tal:block>
			*/

			// Example:
			/*
				<tal:block
					data-something
					class="sada"
					tal:condition="false"
					tal:repeat="loop loops"
					tal:define="something"
					id="dsapdsaoijd"
					disable>


					<!-- Some indentation -->
						<div>Cool element</div>

				</tal:block>
			*/
			try {

				let preferredAttributeOrder = atom.config.get('atom-attribute-sorter.preferredAttributeOrder');
				if (preferredAttributeOrder && preferredAttributeOrder.length) {
					preferredAttributeOrder = preferredAttributeOrder.split(',');
					preferredAttributeOrder = preferredAttributeOrder.map(function(value){
						return value.trim();
					});
				}

				posthtml()
					.use(attrsSorter({
						// Default Options
						order: preferredAttributeOrder ? preferredAttributeOrder : [
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
						]
					}))
					.process(selection)
					.then(function(result) {
						editor.insertText(result.html)
					})

			} catch (e) {
				console.error(e);
			}


    }
	}

};
