figma.showUI(__html__);
const allowedNodes = ['FRAME', 'COMPONENT'];
figma.ui.onmessage = msg => {
    if (msg.type === 'optimize') {
        let current = 0;
        figma.ui.postMessage({
            function: "start",
            total: figma.currentPage.selection.length
        });
        for (const node of figma.currentPage.selection) {
            if (allowedNodes.includes(node.type)) {
                node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: msg.scale } })
                    .then(res => {
                    node.fills = [{ type: "IMAGE", scaleMode: msg.fillScale, imageHash: figma.createImage(res).hash }];
                    if ('children' in node) {
                        for (const child of node.children) {
                            child.visible = false;
                        }
                    }
                    figma.ui.postMessage({
                        function: "progress",
                        current: ++current
                    });
                }).catch(err => figma.notify("Unable to optimize. Error " + err.message, { error: true }));
            }
        }
    }
    if (msg.type === 'revert') {
        figma.ui.postMessage({ function: "start" });
        for (const node of figma.currentPage.selection) {
            if (allowedNodes.includes(node.type)) {
                node.fills = [];
                if ('children' in node) {
                    for (const child of node.children) {
                        child.visible = true;
                    }
                }
            }
        }
    }
};
