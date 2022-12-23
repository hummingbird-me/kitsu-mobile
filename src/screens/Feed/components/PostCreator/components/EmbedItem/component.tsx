import { isEmpty } from 'lodash';
import React, { PureComponent } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';

import { kitsuConfig } from 'kitsu/config/env';
import { darkGrey } from 'kitsu/constants/colors';
import { EmbeddedContent } from 'kitsu/screens/Feed/components/EmbeddedContent';
import { EmbedUrlCache } from 'kitsu/utils/cache';

import { styles } from './styles';

interface EmbedItemProps {
  url?: string;
  width?: number;
}

export class EmbedItem extends PureComponent<EmbedItemProps> {
  static defaultProps = {
    url: '',
    width: null,
  };

  state = {
    loading: false,
    embed: null,
  };

  componentDidMount() {
    this.mounted = true;
    this.fetchEmbed(this.props.url);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      this.fetchEmbed(nextProps.url, true);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted = false;

  async fetchEmbed(url, force = false) {
    if (!this.mounted) return;

    const { loading } = this.state;
    if (isEmpty(url)) {
      this.setState({
        embed: null,
        loading: false,
      });
      return;
    }

    // Check if we have a chached embed
    if (EmbedUrlCache.has(url)) {
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
      if (
        url &&
        this.props.url &&
        url.toLowerCase() === this.props.url.toLowerCase()
      ) {
        this.setState({
          loading: false,
          embed,
        });
      }
    } catch (e) {
      console.log(e);

      // Check if we should update loading
      if (
        url &&
        this.props.url &&
        url.toLowerCase() === this.props.url.toLowerCase()
      ) {
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
          minWidth={maxWidth}
          maxWidth={maxWidth}
          disabled
        />
      );
    }

    return null;
  }
}
