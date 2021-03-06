/**
 * External dependencies
 */
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as SlotFillProvider } from 'react-slot-fill';
import { omit } from 'lodash';

/**
 * Internal dependencies
 */
import './assets/stylesheets/main.scss';
import Layout from './layout';
import { createReduxStore } from './state';

/**
 * Initializes and returns an instance of Editor.
 *
 * @param {String} id   Unique identifier for editor instance
 * @param {Object} post API entity for post to edit
 */
export function createEditorInstance( id, post ) {
	const store = createReduxStore();
	store.dispatch( {
		type: 'RESET_BLOCKS',
		post,
		blocks: wp.blocks.parse( post.content.raw ),
	} );

	if ( ! post.id ) {
		// Each property that is set in `post-content.js` (other than `content`
		// because it is serialized when a save is requested) needs to be
		// registered as an edit now.  Otherwise the initial values of these
		// properties will not be properly saved with the post.
		store.dispatch( {
			type: 'SETUP_NEW_POST',
			edits: {
				title: post.title.raw,
				...omit( post, 'title', 'content' ),
			},
		} );
	}

	wp.element.render(
		<ReduxProvider store={ store }>
			<SlotFillProvider>
				<Layout />
			</SlotFillProvider>
		</ReduxProvider>,
		document.getElementById( id )
	);
}
