import M from 'materialize-css';
import localizeFilter from '@/filters/localize.filter';

export default {
  bind(el, { value, modifiers }) {
    M.Tooltip.init(el, {
      html: modifiers.nolocalize ? value : localizeFilter(value),
    });
  },
  unbind(el) {
    const tooltip = M.Tooltip.getInstance(el);

    if (tooltip && tooltip.destroy) {
      tooltip.destroy();
    }
  },
};
