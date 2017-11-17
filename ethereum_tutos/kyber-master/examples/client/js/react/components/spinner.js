import React from 'react';
import classNames from 'classnames';


const Spinner = React.createClass({
    propTypes: {
        classNames: React.PropTypes.string,
        color: React.PropTypes.oneOf(
            ['black', 'blue', 'dark-blue', 'light-blue', 'pink', 'white', 'loop']
        ),
        size: React.PropTypes.oneOf(
            ['sm', 'md', 'lg']
        )
    },

    getDefaultProps() {
        return {
            inline: false,
            size: 'md',
            color: 'black'
        };
    },

    render() {
        const {
            classNames: classes,
            color,
            size
        } = this.props;

        return (
            <div
                className={classNames(`spinner-wrapper-${size}`,
                                      color ? `spinner-wrapper-${color}` : null,
                                      classes)}>
                <div className="spinner-circle" />
                <div className="spinner-inner">A</div>
            </div>
        );
    }
});

export default Spinner;
