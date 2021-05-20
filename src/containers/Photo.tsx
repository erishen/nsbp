import React, { Fragment, useState } from 'react'
import Header from '../component/Header'
import Layout from '../component/Layout'
import { Helmet } from 'react-helmet'
import { Container, Row } from '../styled/photo'
import { Motion, spring } from 'react-motion'

const springSettings = { stiffness: 170, damping: 26 }
const NEXT = 'show-next'

const Photo = ({ query }: any) => {
  const [photos, setPhotos] = useState([
    [500, 350],
    [800, 600],
    [800, 400],
    [700, 500],
    [200, 650],
    [600, 600]
  ])
  const [currPhoto, setCurrPhoto] = useState(0)

  const [currWidth, currHeight] = photos[currPhoto]

  const widths = photos.map(([origW, origH]) => (currHeight / origH) * origW)

  const leftStartCoords = widths
    .slice(0, currPhoto)
    .reduce((sum, width) => sum - width, 0)

  let configs: any = []
  photos.reduce((prevLeft, [origW, origH], i) => {
    configs.push({
      left: spring(prevLeft, springSettings),
      height: spring(currHeight, springSettings),
      width: spring(widths[i], springSettings)
    })
    return prevLeft + widths[i]
  }, leftStartCoords)

  const handleChange = ({ target: { value } }: any) => {
    setCurrPhoto(value)
  }

  const clickHandler = (btn: any) => {
    let photoIndex = btn === NEXT ? currPhoto + 1 : currPhoto - 1

    photoIndex = photoIndex >= 0 ? photoIndex : photos.length - 1
    photoIndex = photoIndex >= photos.length ? 0 : photoIndex

    setCurrPhoto(photoIndex)
  }

  return (
    <Fragment>
      <Helmet>
        <title>Photo</title>
        <meta name="description" content="Photo Description" />
      </Helmet>
      <Header />

      <Layout query={query}>
        <Container>
          <div>Scroll Me</div>
          <Row>
            <button onClick={() => clickHandler('')}>Previous</button>
            <input
              type="range"
              min={0}
              max={photos.length - 1}
              value={currPhoto}
              onChange={handleChange}
            />
            <button onClick={() => clickHandler(NEXT)}>Next</button>
          </Row>
          <div className="demo4">
            <Motion
              style={{ height: spring(currHeight), width: spring(currWidth) }}
            >
              {(container) => (
                <div className="demo4-inner" style={container}>
                  {configs.map((style: any, i: any) => (
                    <Motion key={i} style={style}>
                      {(style) => (
                        <img
                          className="demo4-photo"
                          src={`/images/${i}.jpg`}
                          style={style}
                        />
                      )}
                    </Motion>
                  ))}
                </div>
              )}
            </Motion>
          </div>
        </Container>
      </Layout>
    </Fragment>
  )
}

export default Photo
