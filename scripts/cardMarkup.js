const cardCreator = (image, title) => `<div class="eventCard">
          <div class="eventImgСontainer">
            <img
              class="eventImg"
              src="${image}"
              alt="${title}"
            />
          </div>
          <div class="eventInfo">
            <span class="eventTitle">${title}</span>
            <span class="eventDescription"> 15 seconds to timing </span>
          </div>
        </div>`;
