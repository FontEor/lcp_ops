export const templateData = {
  nodeList: [{
      id: "node_1", // String，可选，节点的唯一标识
      node_code: "merchantOrder",
      node_name: "商家下单",
      label: "商家下单", // String，节点标签
      x: 40, // Number，必选，节点位置的 x 值
      y: 94, // Number，必选，节点位置的 y 值
    },
    {
      id: "node_2",
      node_code: "receiveTaskAssignment",
      node_name: "揽收任务分配",
      label: "揽收任务分配",
      x: 210,
      y: 94,
    },
    {
      id: "node_2_1",
      node_code: "terminationOfCollection",
      node_name: "终止揽收",
      label: "终止揽收",
      x: 210,
      y: 164,
    },
    {
      id: "node_3",
      node_code: "collectionCompleted",
      node_name: "揽收完成",
      label: "揽收完成",
      x: 380,
      y: 94,
    },
    {
      id: "node_3_1",
      node_code: "pickupAndReturnCompleted",
      node_name: "上门接货退货完成",
      label: "上门接货\n退货完成",
      x: 380,
      y: 164,
    },
    {
      id: "node_4",
      node_code: "siteDelivery",
      node_name: "站点发货",
      label: "站点发货",
      x: 550,
      y: 94,
    },
    {
      id: "node_5",
      node_code: "sortAndInspectGoods",
      node_name: "分拣验货",
      label: "分拣验货",
      x: 720,
      y: 94,
    },
    {
      id: "node_6",
      node_code: "sortingAndShipping",
      node_name: "分拣发货",
      label: "分拣发货",
      x: 890,
      y: 94,
    },
    {
      id: "node_7",
      node_code: "siteInspection",
      node_name: "站点验货",
      label: "站点验货",
      x: 1060,
      y: 94,
    },
    {
      id: "node_8",
      node_code: "delivery",
      node_name: "派件",
      label: "派件",
      x: 1230,
      y: 94,
    },
    {
      id: "node_8_1",
      node_code: "siteReprojection",
      node_name: "站点再投",
      label: "站点再投",
      x: 1230,
      y: 164,
    },
    {
      id: "node_8_2",
      node_code: "negotiatedResubmission",
      node_name: "发起协商再投",
      label: "发起协商再投",
      x: 1230,
      y: 24,
    },

    {
      id: "node_9",
      node_code: "dulyDelivered",
      node_name: "妥投",
      label: "妥投",
      x: 1400,
      y: 94,
    }
  ],
  edgesList: [{
      source: "node_1",
      target: "node_2",
    },
    {
      source: "node_2",
      target: "node_3",
    },
    {
      source: "node_2",
      target: "node_2_1",
    },
    {
      source: "node_3",
      target: "node_4",
    },
    {
      source: "node_3",
      target: "node_3_1",
    },
    {
      source: "node_4",
      target: "node_5",
    },
    {
      source: "node_5",
      target: "node_6",
    },
    {
      source: "node_6",
      target: "node_7",
    },
    {
      source: "node_7",
      target: "node_8",
    },
    {
      source: "node_8",
      target: "node_9",
    },

    {
      source: "node_8",
      target: "node_8_1",
    },

    {
      source: "node_8",
      target: "node_8_2",
    },
    {
      source: "node_8_1",
      target: "node_9",
      router: {
        name: 'orth',
      },
    },
    {
      source: "node_8_2",
      target: "node_9",
      router: {
        name: 'orth',
      },
    },

  ]
};
