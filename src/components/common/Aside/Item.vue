<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    /**
     * 京东夸克图标库http://quark.jd.com/icon/
     * fontFamilyClass自定义名字后，如svgfont
     * 因为JavaScript只能处理UCS-2编码，所以json回来的unicode图标需转码
     * 例如：let obj = {icon: '&#xe70b;'} => let obj = { icon: '\ue70b'}
     */
    if (icon) {
      vnodes.push(<i class="iconfont sidebar-icon">{(icon)}</i>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
