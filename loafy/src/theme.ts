export const colors = {
  background: '#FFF7EC',
  surface: '#FFFFFF',
  surfaceWarm: '#FDEBD0',
  text: '#3B2314',
  textMuted: '#8C6A52',
  crust: '#B8662B',
  crustDark: '#8A4516',
  golden: '#F2A93B',
  goldenSoft: '#FCE3B3',
  success: '#4E9A5B',
  border: '#EED9BF',
  overlay: 'rgba(59, 35, 20, 0.45)',
  white: '#FFFFFF',
};

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const font = {
  title: { fontSize: 28, fontWeight: '800' as const, color: colors.text },
  heading: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 16, color: colors.text, lineHeight: 23 },
  caption: { fontSize: 13, color: colors.textMuted },
};
