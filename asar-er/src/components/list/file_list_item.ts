import { PropType, defineComponent } from 'vue';

let clickTime = -1;
let clickItemPath = '';

export default defineComponent({
  props: {
    columns: {
      type: [] as PropType<
        {
          className?: string;
          style?: { [key: string]: string };
          text?: string | number;
        }[]
      >,
      default: () => [],
    },
    value: {
      type: Object as PropType<ListItem>,
      required: true,
    },
  },
  data() {
    return {
      clickTime: -1,
      clickItemPath: '',
    };
  },
  methods: {
    onClick(e: MouseEvent) {
      const data = this.value;
      this.$emit('click', e, data);
      if (clickTime === -1) {
        clickTime = Date.now();
        clickItemPath = data.path;
      } else {
        if (Date.now() - clickTime <= 300 && data.path === clickItemPath) {
          clickTime = -1;
          clickItemPath = '';
          this.$emit('doubleclick', e, data);
        } else {
          clickTime = Date.now();
          clickItemPath = data.path;
        }
      }
    },
    onDragStart() {
      this.$emit('dragstart');
    },
  },
});
