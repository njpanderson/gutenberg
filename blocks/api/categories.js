/**
 * WordPress dependencies
 */
import { __ } from 'i18n';

/**
 * Block categories.
 *
 * Group blocks together based on common traits
 * The block "inserter" relies on these to present the list blocks
 *
 * @var {Array} categories
 */
const categories = [
	{ slug: 'common', title: __( 'Common Blocks' ) },
	{ slug: 'formatting', title: __( 'Formatting' ) },
	{ slug: 'embed', title: __( 'Embed' ) },
	{ slug: 'layout', title: __( 'Layout Blocks' ) },
];

/**
 * Returns all the block categories
 *
 * @return {Array} Block categories
 */
export function getCategories() {
	return categories;
}
