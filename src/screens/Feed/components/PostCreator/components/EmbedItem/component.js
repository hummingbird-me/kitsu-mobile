import React, { PureComponent } from 'react';
import { View, Dimensions, ActivityIndicator } from 'react-native';
import { PropTypes } from 'prop-types';
import { isEmpty } from 'lodash';
import { EmbedUrlCache } from 'kitsu/utils/cache';
import { kitsuConfig } from 'kitsu/config/env';
import { EmbeddedContent } from 'kitsu/screens/Feed/components/EmbeddedContent';
import { darkGrey } from 'kitsu/constants/colors';
import { styles } from './styles';

export class EmbedItem extends PureComponent {
  static propTypes = {
    url: PropTypes.string,
    width: PropTypes.number,
  }

  static defaultProps = {
    url: '',
    width: null,
  }

  state = {
    loading: false,
    embed: null,
  }

  componentDidMount() {
    this.fetchEmbed(this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      this.fetchEmbed(nextProps.url, true);
    }
  }

  async fetchEmbed(url, force = false) {
    const { loading } = this.state;
    if (isEmpty(url)) {
      this.setState({
        embed: null,
        loading: false,
      });
      return;
    }

    // Check if we have a chached embed
    if (EmbedUrlCache.contains(url)) {
      const embed = EmbedUrlCache.get(url);
      this.setState({
        embed,
        loading: false,
      });
      return;
    }

    // Don't bother fetching unless we force it
    if (!force && loading) return;
    this.setState({ loading: true });

    // Fetch the embed
    try {
      const response = await fetch(`${kitsuConfig.baseUrl}/edge/embeds`, {
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ url }),
      });
      const embed = await response.json();

      // Set the cache
      EmbedUrlCache.set(url, embed);

      // Check if we have the same url as props
      // This could change if url is changed while we're fetching
      if (url && this.props.url && url.toLowerCase() === this.props.url.toLowerCase()) {
        this.setState({
          loading: false,
          embed,
        });
      }
    } catch (e) {
      console.log(e);

      // Check if we should update loading
      if (url && this.props.url && url.toLowerCase() === this.props.url.toLowerCase()) {
        this.setState({ loading: false });
      }
    }
  }

  render() {
    const { width } = this.props;
    const { loading, embed } = this.state;

    const maxWidth = width || Dimensions.get('window').width;

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={darkGrey} />
        </View>
      );
    }

    if (embed) {
      return (
        <EmbeddedContent
          embed={embed}
          ignoreDataSaver
          maxWidth={maxWidth}
          disabled
        />
      );
    }

    return null;
  }
}
