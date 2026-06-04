// 301-redirects för uppstädningen av designer- och fotograf-video-yrkets
// recensioner (se scripts/cleanup-designer-fotograf.ts).
//   A) Verktyg med kanonisk recension någon annanstans → kanoniska sidan.
//   B) Verktyg utan kanonisk → flyttade till rätt kategori-hub (gammal yrke-URL → ny).
//   C) Tomma depth-5 topplista-hubbar → kanonisk kategori-hub.
/** @type {{source: string, destination: string, statusCode: number}[]} */
export const designerFotografRedirects = [
  {
    "source": "/ai-verktyg/foretag/yrke/designer/bildgenerering/midjourney-design",
    "destination": "/ai-verktyg/midjourney",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/grafisk-design/adobe-firefly-design",
    "destination": "/ai-verktyg/adobe-firefly",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/grafisk-design/canva-ai-design",
    "destination": "/ai-verktyg/canva-ai",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/ui-ux/framer-ai-ux",
    "destination": "/ai-verktyg/framer-ai",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/videoredigering/runway-design",
    "destination": "/ai-video/runway-gen-3",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering/firefly-fbild",
    "destination": "/ai-verktyg/adobe-firefly",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering/pika-fbild",
    "destination": "/ai-video/pika-labs",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering/runway-fbild",
    "destination": "/ai-video/runway-gen-3",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/ljudsattning/krisp-ljud",
    "destination": "/ai-verktyg/krisp",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/videoklippning/canva-video-vklipp",
    "destination": "/ai-verktyg/canva-ai",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/bildgenerering/khroma-design",
    "destination": "/ai-verktyg/khroma-design",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/grafisk-design/looka-design",
    "destination": "/ai-verktyg/looka-design",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/ui-ux/figma-ai-ux",
    "destination": "/ai-verktyg/figma-ai-ux",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/ui-ux/galileo-ai-ux",
    "destination": "/ai-verktyg/galileo-ai-ux",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/ui-ux/uizard-ux",
    "destination": "/ai-verktyg/uizard-ux",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/bildredigering/luminar-neo-bredig",
    "destination": "/ai-verktyg/luminar-neo-bredig",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/bildredigering/removebg-bredig",
    "destination": "/ai-verktyg/removebg-bredig",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/bildredigering/topaz-photo-bredig",
    "destination": "/ai-verktyg/topaz-photo-bredig",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/ljudsattning/descript-ljud",
    "destination": "/ai-verktyg/descript-ljud",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/videoklippning/capcut-ai-vklipp",
    "destination": "/ai-video/capcut-ai-vklipp",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/grafisk-design",
    "destination": "/ai-verktyg/ai-bild-verktyg",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/bildgenerering",
    "destination": "/ai-verktyg/ai-bild-verktyg",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/ui-ux",
    "destination": "/ai-verktyg/ui-ux",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/designer/videoredigering",
    "destination": "/ai-video",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/bildredigering",
    "destination": "/ai-verktyg/ai-bild-verktyg",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering",
    "destination": "/ai-verktyg/ai-bild-verktyg",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/videoklippning",
    "destination": "/ai-video",
    "statusCode": 301
  },
  {
    "source": "/ai-verktyg/foretag/yrke/fotograf-video/ljudsattning",
    "destination": "/ai-verktyg/ai-ljud-och-musik",
    "statusCode": 301
  }
];
