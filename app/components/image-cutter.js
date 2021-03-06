import React, {Component, PropTypes} from 'react';
import hotkeys from 'hotkeys-js';
import Platform from 'Platform';
import AreaSelector from './area-selector';
import Icon from './icon';
import Avatar from './avatar';
import timeSequence from '../utils/time-sequence';

/**
 * Image cutter component
 *
 * @class ImageCutter
 * @extends {Component}
 */
class ImageCutter extends Component {
    static defaultProps = {
        sourceImage: null,
        style: null,
        onFinish: null,
        onCancel: null,
    };

    static propTypes = {
        sourceImage: PropTypes.string,
        style: PropTypes.object,
        onFinish: PropTypes.func,
        onCancel: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            hover: true,
        };
    }

    componentDidMount() {
        this.HotkeysScope = timeSequence();
        hotkeys.setScope(this.HotkeysScope);
        hotkeys('esc', this.HotkeysScope, e => {
            this.handleCloseButtonClick();
        });
        hotkeys('enter', this.HotkeysScope, e => {
            this.handleOkButtonClick();
        });
    }

    componentWillUnmount() {
        hotkeys.deleteScope(this.HotkeysScope);
    }

    handleOkButtonClick = e => {
        if (this.select) {
            Platform.image.cutImage(this.props.sourceImage, this.select).then(image => {
                this.props.onFinish && this.props.onFinish(image);
            });
        } else {
            this.props.onFinish && this.props.onFinish(null);
        }
    }

    handleCloseButtonClick = e => {
        if (this.props.onFinish) {
            this.props.onFinish(null);
        }
    }

    handleSelectArea = (select) => {
        this.select = select;
    }

    render() {
        let {
            sourceImage,
            style,
            onFinish,
            onCancel,
            ...other
        } = this.props;

        let imageUrl = 'file://' + sourceImage.replace(/\\/g, '/');

        style = Object({
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url("${imageUrl}")`,
            backgroundPosition: 'center',
            backgroundSize: 'contain'
        }, style);

        const toolbarIconStyle = {
            cursor: 'pointer',
            padding: 10,
            width: 20,
            height: 20,
            textAlign: 'center',
        };

        const toolbar = (<nav
            className="layer nav primary-pale"
            style={{marginTop: 2, marginBottom: 2}}
        >
            <a onClick={this.handleCloseButtonClick}><Icon name="close icon-2x text-danger" /></a>
            <a onClick={this.handleOkButtonClick}><Icon name="check icon-2x text-success" /></a>
        </nav>);

        return (<div
            {...other}
            className="dock user-app-no-dragable"
            style={style}
            onMouseEnter={e => {this.setState({hover: true});}}
            onMouseLeave={e => {this.setState({hover: false});}}
        >
            <AreaSelector
                onSelectArea={this.handleSelectArea}
                style={{zIndex: 2, display: this.state.hover ? 'block' : 'block'}}
                className="dock"
                img={imageUrl}
                toolbarHeight={50}
                toolbar={toolbar}
            />
            <Avatar className="state darken dock dock-right dock-top" icon="close icon-2x" onClick={this.handleCloseButtonClick} />
        </div>);
    }
}

export default ImageCutter;
