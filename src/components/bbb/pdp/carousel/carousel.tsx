import { component$ } from '@builder.io/qwik'

interface SlideImg {
  idx: number
  description: string
  imageId: string
  type: 'image'
}

interface SlideVideo {
  idx: number
  description: string
  thumbSrc: string
  widgetId: string
}

interface SlideCustomerImg {
  idx: number
  description: string
  type: 'image'
  cgcImage: string
  cgcImageThumb: string
  cgcImageZoom: string
}

/**
 * Image or video slide
 */
interface Slide {
  slide: SlideImg | SlideVideo | SlideCustomerImg
  i: number
}
const Slide = component$<Slide>(({ slide, i }) => {
  // TODO: figure out how to add fetchpriority property to an HTMLImageElment type
  // and turn package.json > build.types tsc script back on
  return slide.type == 'image' ? (
    <img
      alt={`${slide.description}. View a larger version of this product image.`}
      class='midCtr contain'
      fetchpriority={i == 0 ? 'high' : 'low'}
      height='380'
      key={slide.imageId}
      loading={i == 0 ? 'eager' : 'lazy'}
      noloading
      src={`https://b3h2.scene7.com/is/image/BedBathandBeyond/${slide.imageId}?$380$&wid=380&hei=380`}
      srcset={`
        https://b3h2.scene7.com/is/image/BedBathandBeyond/${slide.imageId}?$380$&wid=380&hei=380 379w, 
        https://b3h2.scene7.com/is/image/BedBathandBeyond/${slide.imageId}?$713$&wid=713&hei=713 500w
      `}
      width='380'
    />
  ) : null
})

/**
 * Image and Video Carousel / modal with thumbnails
 */
interface Slides {
  slides: Array<Slide>
}
export const ProdCarousel = component$<Slides>(({ slides }) => {
  console.log('Building <ProdCarousel />')
  if (!slides) return null
  return (
    <div class='flex mid hScroll'>
      {slides
        // .slice(0, 1)
        .map((slide: any, i: number) => (
          <Slide slide={slide} i={i} key={i} />
        ))}
    </div>
  )
})
