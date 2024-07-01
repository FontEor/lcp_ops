<template>
  <div class="flowchart-wrap">
    <div class="flowchart" ref="flowchart"></div>
  </div>
</template>

<script>
import { templateData } from "./FlowchartData";
import { Graph, Shape } from "@antv/x6";

export default {
  name: "Flowchart",
  props: ["currentNode"],
  watch: {
    currentNode: {
      handler(newVal) {
        this.graphInit();
      }
    }
  },
  data() {
    return {
      templateData,
      outgoingNodes: [],
      incomingNodes: [],
      graph: {}
    };
  },
  computed: {},
  methods: {
    // 遍历节点
    handleNodes(nodes) {
      let tempNodes = [];
      // 默认节点配置
      const templateNodeOptions = {
        width: 90,
        height: 40,
        shape: "image",
        imageUrl: require("@/assets/img/sandbox/node_1.png"),
        attrs: {
          label: {
            fill: "#3C6EF0"
          }
        },
        zIndex: 5
      };
      // 选中节点配置
      const curNodeOptions = {
        width: 90,
        height: 40,
        shape: "image",
        imageUrl: require("@/assets/img/sandbox/node_3.png"),
        attrs: {
          label: {
            fill: "#ffffff"
          }
        },
        zIndex: 5
      };
      nodes.forEach(item => {
        if (item.id === this.currentNode) {
          Object.assign(item, curNodeOptions);
        } else {
          Object.assign(item, templateNodeOptions);
        }
        tempNodes.push(item);
      });
      return tempNodes;
    },

    // 遍历线
    handleEdges(edges) {
      let tempEdges = [];
      // 默认xian配置
      const templateEdgesOptions = {
        connector: {
          name: "rounded"
        },
        markup: [
          {
            tagName: "path",
            selector: "stroke"
          },
          {
            tagName: "path",
            selector: "fill"
          }
        ],
        attrs: {
          fill: {
            connection: true,
            strokeWidth: 6,
            strokeLinecap: "round",
            fill: "none",
            stroke: {
              type: "linearGradient",
              stops: [
                {
                  offset: "0%",
                  color: "#B7D0FF"
                },
                {
                  offset: "100%",
                  color: "#80A4FF"
                }
              ]
            }
          },
          stroke: {
            fill: "none",
            stroke: "#9fbaf8",
            connection: true,
            strokeWidth: 1,
            strokeLinecap: "round"
          }
        }
      };

      edges.forEach(item => {
        Object.assign(item, templateEdgesOptions);
        tempEdges.push(item);
      });
      return tempEdges;
    },

    // 当前节点的输出节点
    fnGetOutgoingEdges() {
      this.outgoingNodes = [];
      if (this.graph.getOutgoingEdges(this.currentNode)) {
        this.graph.getOutgoingEdges(this.currentNode).forEach(item => {
          let nodeDetails = this.graph.getCellById(item.store.data.target.cell);
          this.outgoingNodes.push(nodeDetails);
        });
      }
    },

    // 当前节点的输入节点
    fnGetIncomingEdges() {
      this.incomingNodes = [];
      if (this.graph.getIncomingEdges(this.currentNode)) {
        this.graph.getIncomingEdges(this.currentNode).forEach(item => {
          let nodeDetails = this.graph.getCellById(item.store.data.source.cell);
          this.incomingNodes.push(nodeDetails);
        });
      }
    },

    // flowchart子节点全删除
    empty(e) {
      while (e.firstChild) {
        e.removeChild(e.firstChild);
      }
    },

    // 生成流程图
    graphInit() {
      this.empty(this.$refs.flowchart);
      // this.graph.clearCells;
      this.graph = new Graph({
        container: this.$refs.flowchart,
        height: this.$refs.flowchart.clientHeight,
        panning: true, //是否支持拖拽平移
        autoResize: true,
        scaling: { min: 0.6, max: 1 },
        interacting: function(cellView) {
          nodeMovable: false;
        }
      });

      const data = {
        // 节点
        nodes: this.handleNodes(this.templateData.nodeList),
        // 边
        edges: this.handleEdges(this.templateData.edgesList)
      };
      this.graph.fromJSON(data);
      // 输出边线
      this.fnGetOutgoingEdges();
      // 输入边线
      this.fnGetIncomingEdges();

      // 自适应流程图
      this.graph.on("resize", ({ width, height }) => {
        // graph.scale(width / 1640 + 0.08);
        this.graph.scaleContentToFit();
        this.graph.centerContent();
      });
      this.graph.scaleContentToFit();
      this.graph.centerContent();

      this.$emit(
        "change",
        this.graph.getCellById(this.currentNode),
        this.outgoingNodes,
        this.incomingNodes
      );
    }
  },
  mounted() {
    this.graphInit();
  }
};
</script>

<style lang="scss" scoped>
.flowchart-wrap {
  width: 100%;
  height: 100%;
}
.flowchart {
  height: 228px;
}
</style>
