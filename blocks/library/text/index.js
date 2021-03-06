/**
 * Internal dependencies
 */
import { registerBlockType, createBlock, query } from '../../api';
import Editable from '../../editable';

const { children } = query;

registerBlockType( 'core/text', {
	title: wp.i18n.__( 'Text' ),

	icon: 'text',

	category: 'common',

	attributes: {
		content: children(),
	},

	defaultAttributes: {
		content: <p />,
	},

	merge( attributes, attributesToMerge ) {
		return {
			content: wp.element.concatChildren( attributes.content, attributesToMerge.content ),
		};
	},

	edit( { attributes, setAttributes, insertBlockAfter, focus, setFocus, mergeBlocks } ) {
		const { content } = attributes;

		return (
			<Editable
				value={ content }
				onChange={ ( nextContent ) => {
					setAttributes( {
						content: nextContent,
					} );
				} }
				focus={ focus }
				onFocus={ setFocus }
				onSplit={ ( before, after ) => {
					setAttributes( { content: before } );
					insertBlockAfter( createBlock( 'core/text', {
						content: after,
					} ) );
				} }
				onMerge={ mergeBlocks }
				showAlignments
			/>
		);
	},

	save( { attributes } ) {
		const { content } = attributes;
		return content;
	},
} );
