import { StyleSheet, Platform } from 'react-native';
import { isX, paddingX } from 'kitsu/utils/isX';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.lightestGrey,
    paddingTop: Platform.select({ ios: 77, android: 72 }),
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
    fontSize: 44,
    fontWeight: '800',
    marginRight: 6,
  },
  durationText: {
    color: colors.green,
    fontWeight: '800',
    fontSize: 15,
  },
  billText: {
    color: colors.grey,
    fontWeight: 'bold',
    fontSize: 12,
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
    paddingHorizontal: 16,
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
    top: -13,
    fontWeight: 'bold',
    backgroundColor: 'white',
    padding: 4,
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
});
