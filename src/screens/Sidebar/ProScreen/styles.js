import { StyleSheet, Platform } from 'react-native';
import { isX, safeAreaInsetX } from 'kitsu/utils/isX';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.lightestGrey,
    paddingTop: Platform.select({ ios: 77, android: 72 }),
    paddingBottom: isX ? safeAreaInsetX.bottom : 0,
  },
  gradientContainer: {
    padding: 16,
    paddingVertical: 30,
  },
  kitsuLogoContainer: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
  },
  proTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: 'bold',
  },
  proDescription: {
    marginVertical: 16,
    fontSize: 15,
    color: colors.offWhite,
  },
  proCard: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceTag: {
    color: '#444444',
    fontSize: 34,
    fontWeight: '800',
    marginRight: 6,
  },
  durationText: {
    color: colors.green,
    fontWeight: '800',
    fontSize: 14,
  },
  billText: {
    color: colors.grey,
    fontWeight: 'bold',
    fontSize: 11,
  },
  proButton: {
    width: '100%',
    backgroundColor: colors.green,
    marginTop: 8,
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  proButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  perksContainer: {
    backgroundColor: colors.white,
    padding: 16,
    zIndex: 2,
  },
  perksInfo: {
    marginVertical: 16,
    paddingBottom: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perksInfoHeading: {
    color: colors.offBlack,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'white',
    padding: 4,
    marginVertical: 8,
  },
  perksList: {
    paddingHorizontal: 16,
  },
  perksInfoSection: {
    paddingVertical: 16,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  perksInfoSection_first: {
    paddingTop: 0,
  },
  perksInfoSection_last: {
    borderBottomWidth: 0,
    paddingVertical: 0,
    paddingTop: 16,
  },
  perkTitle: {
    color: colors.offBlack,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  perkDescription: {
    color: colors.offBlack,
    fontSize: 13,
  },
  artContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  art: {
    width: 200,
    height: 120,
  },
  footer: {
    padding: 16,
    paddingVertical: 24,
    backgroundColor: colors.lightestGrey,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  avatarMask: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.lightestGrey,
    overflow: 'hidden',
  },
  avatarTag: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  avatarTagText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  avatarTagContainer: {
    height: '100%',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    position: 'absolute',
    paddingLeft: 70,
  },
  errorContainer: {
    padding: 16,
    marginBottom: 4,
    backgroundColor: colors.red,
  },
  errorText: {
    color: colors.white,
  },
  restorePurchase: {
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  restorePurchaseText: {
    marginBottom: 4,
    fontSize: 15,
    color: colors.offBlack,
    textAlign: 'center',
    fontWeight: '400',
  },
});
