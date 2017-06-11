/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import IconButton from '../icon-button';

function Toolbar( { controls, focus } ) {
	if ( ! controls || ! controls.length ) {
		return null;
	}

	// Ensure controls are a nested array
	if ( controls &&
			( controls[ 0 ] && ! controls[ 0 ].length )
	) {
		controls = [ controls ];
	}

	return (
		<ul className="components-toolbar">
			{ controls.map( ( set, setIndex ) => (
				<li key={ setIndex }>
					<ul>
						{ set.map( ( control, index ) => (
							<li key={ index }>
								<IconButton
									key={ index }
									icon={ control.icon }
									label={ control.title }
									data-subscript={ control.subscript }
									onClick={ ( event ) => {
										event.stopPropagation();
										control.onClick();
									} }
									className={ classNames( 'components-toolbar__control', {
										'is-active': control.isActive,
										'left-divider': control.leftDivider,
									} ) }
									aria-pressed={ control.isActive }
									focus={ focus && ! index }
								/>
							</li>
						) ) }
					</ul>
				</li>
			) ) }
		</ul>
	);
}

export default Toolbar;
