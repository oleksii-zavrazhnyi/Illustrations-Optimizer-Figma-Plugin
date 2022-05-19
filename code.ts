figma.showUI(__html__);

const allowedNodes = ['FRAME', 'COMPONENT']

figma.ui.onmessage = msg => {

  if (msg.type === 'optimize') {
    for (const node of figma.currentPage.selection) {
      if (allowedNodes.includes(node.type)) {
        node.exportAsync({format: 'PNG', constraint: { type: 'SCALE', value: msg.retina ? 2 : 1 }})
          .then(res => {
            node.fills = [{type: "IMAGE", scaleMode: msg.fillScale, imageHash: figma.createImage(res).hash }]
            if ('children' in node) {
              for (const child of node.children) {
                child.visible = false
              }
            }
          })
          .catch(err => console.error(err))
        }
    }
  }

  if (msg.type === 'revert') {
    for (const node of figma.currentPage.selection) {
      if (allowedNodes.includes(node.type)) {
        node.fills = []
        if ('children' in node) {
          for (const child of node.children) {
            child.visible = true
          }
        }
      }
    }
  }
};
