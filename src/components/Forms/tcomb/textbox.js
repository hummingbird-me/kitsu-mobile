import React from 'react';
import { View, Text } from 'react-native';
import { Input, Item } from 'native-base';
import CustomIcon from 'kitsu/components/Icon';

function textbox(locals) {
  if (locals.hidden) {
    return null;
  }

  const stylesheet = locals.stylesheet;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  const errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  const help = locals.help
    ? <Text style={{ ...helpBlockStyle, fontSize: 12 }}>{locals.help}</Text>
    : null;
  const error = locals.hasError && locals.error
    ? (<Text accessibilityLiveRegion="polite" style={{ ...errorBlockStyle, fontSize: 12, paddingTop: 2, paddingLeft: 2 }}>
      {locals.error}
    </Text>)
    : null;

  return (
    <View>
      <Item
        style={{
          borderBottomColor: locals.hasError ? 'red' : 'rgba(255,255,255,0.2)',
          borderBottomWidth: 0.5,
        }}
      >
        <View style={styles.iconWrapper}>
          <CustomIcon
            name={locals.label}
            size={locals.label === 'password-icon' ? 18 : 13}
            color="white"
            styles={{ opacity: 0.5 }}
          />
        </View>
        <Input
          ref="input"
          autoCapitalize={locals.autoCapitalize}
          autoCorrect={locals.autoCorrect}
          autoFocus={locals.autoFocus}
          blurOnSubmit={locals.blurOnSubmit}
          editable={locals.editable}
          keyboardType={locals.keyboardType}
          maxLength={locals.maxLength}
          multiline={locals.multiline}
          onBlur={locals.onBlur}
          onEndEditing={locals.onEndEditing}
          onFocus={locals.onFocus}
          onLayout={locals.onLayout}
          onSelectionChange={locals.onSelectionChange}
          onSubmitEditing={locals.onSubmitEditing}
          onContentSizeChange={locals.onContentSizeChange}
          placeholderTextColor={locals.placeholderTextColor}
          secureTextEntry={locals.secureTextEntry}
          selectTextOnFocus={locals.selectTextOnFocus}
          selectionColor={locals.selectionColor}
          numberOfLines={locals.numberOfLines}
          underlineColorAndroid={locals.underlineColorAndroid}
          clearButtonMode={locals.clearButtonMode}
          clearTextOnFocus={locals.clearTextOnFocus}
          enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
          keyboardAppearance={locals.keyboardAppearance}
          onKeyPress={locals.onKeyPress}
          returnKeyType={locals.returnKeyType}
          selectionState={locals.selectionState}
          onChangeText={value => locals.onChange(value)}
          onChange={locals.onChangeNative}
          placeholder={locals.placeholder}
          style={styles.field}
          value={locals.value}
        />
      </Item>
      {help}
      {error}
    </View>
  );
}

const styles = {
  iconWrapper: {
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  field: {
    fontSize: 15,
    lineHeight: 20,
    height: 40.5,
    fontFamily: 'OpenSans',
    color: 'rgba(255,255,255,0.7)',
  },
};

module.exports = textbox;
