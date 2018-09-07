import React, { Component, Fragment } from 'react';
import { ButtonRef, Composition, ImageRef, TextRef, BackHandler, FocusManager } from '@youi/react-native-youi';


export default class PDP extends Component {



  render() {


    return (
      <Composition source="PDP_Main">

      </Composition>
    );
  }
}

// function Metadata(asset) {
//   if (!asset)
//     return null;

//   console.log(asset)
//   let releaseDate = asset.release_date.split("-")[0];
//   let rating = asset.releases.countries.find((release) => release["iso_3166_1"] === "US");
//   rating = rating && rating.certification ? "Rated " + rating.certification : null;
//   let runtime = asset.runtime ? asset.runtime + " mins" : null;
//   let details = [releaseDate, rating, runtime].filter((item) => item !== null).join(" | ");

//   let director = asset.credits.crew.find((member) => member["job"] === "Director");
//   director = director ? director.name : "";
//   let stars = asset.credits.cast.slice(0, 3).map((member) => member["name"]).join(", ");

//   let posterSource = "http://image.tmdb.org/t/p/w500" + asset.poster_path;
//   let backdropSource = "http://image.tmdb.org/t/p/w1280" + asset.backdrop_path;

//   return (
//     <Fragment>
//       <TextRef name="Title-Text" text={asset.title} />
//       <TextRef name="Details-Text" text={details} />
//       <TextRef name="Director" text={director} />
//       <TextRef name="Stars" text={stars} />
//       <TextRef name="Body-Text" text={asset.overview} />
//       <ImageRef name="Image-2x3" source={{ uri: posterSource }} />
//       <ImageRef name="Image-16x9" source={{ uri: backdropSource }} />
//     </Fragment>
//   );
// }
