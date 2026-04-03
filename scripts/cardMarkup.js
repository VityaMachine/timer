const cardCreator = (image, title, timing, status) => `<div class="eventCard">
          <div class="eventImgСontainer">
            
            <img
              class="eventImg"
              src="${image}"
              alt="${title}"
            />
          </div>
          <div class="eventInfo ${status && timing !== null ? status + "CardText" : ""}"">
            <span class="eventTitle">${title}</span>
            <span class="eventDescription">${timing === null ? "DONE" : timing === 0 ? "TIMING" : `${timing} seconds to timing`}  </span>
          </div>
        </div>`;
export default cardCreator;
