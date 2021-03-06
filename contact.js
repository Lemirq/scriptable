const FONT = {
    regular: Font.regularSystemFont(14),
    heading: Font.boldSystemFont(25)
    };
    
    // Colors
    const COLORS = {
      bg: new Color("#141414"),
      txt: new Color("#f4f4f4")
    };
    
    const contacts_list = [
      {
        name: "Placeholder",
        phone: "+0123456789",
        type: "sms",
        photo: "1.png",
      },
      {
        name: "Placeholder",
        phone: "+0123456789",
        type: "facetime",
        photo: "2.png",
      },
      {
        name: "Placeholder",
        phone: "+0123456789",
        type: "call",
        photo: "3.png",
      },
      {
        name: "Placeholder",
        phone: "+0123456789",
        type: "whatsapp",
        photo: "4.png",
      },
    ];
    
    let widget = await createWidget();
    
    // Check where the script is running
    if (config.runsInWidget) {
      // Runs inside a widget so add it to the homescreen widget
      Script.setWidget(widget);
    } else {
      // Show the medium widget inside the app
      widget.presentMedium();
    }
    Script.complete();
    
    async function createWidget() {
      // Create new empty ListWidget instance
      let listwidget = new ListWidget();
    
      // Set new background color
      listwidget.backgroundColor = COLORS.bg;
    
      // Add widget heading
      let heading = listwidget.addText("Contact");
      heading.centerAlignText();
      heading.font = Font.boldSystemFont(25);
      heading.textColor = COLORS.txt;
      
      // Spacer between heading and launch date
      listwidget.addSpacer(15);
      
      // Fetch next launch date
      let launch = await getNextLaunch();
      let launchDateTime = getLaunchDateTime(launch);
    
      // Add the launch time to the widget
      displayLaunchDateTime(listwidget, launchDateTime, launch.date_precision);
    
      // Return the created widget
      return listwidget;
    }
    
    async function getNextLaunch() {
      // Query url
      const url = "https://api.spacexdata.com/v4/launches/next";
    
      // Initialize new request
      const request = new Request(url);
    
      // Execute the request and parse the response as json
      const response = await request.loadJSON();
    
      // Return the returned launch data
      return response;
    }
    
    function getLaunchDateTime(launchData) {
      // Parse launch date to new date object
      const launchDateTime = new Date(launchData.date_utc);
      return launchDateTime;
    }
    
    function displayLaunchDateTime(stack, launchDateTime, precision) {
      // Check if next launch date is precise enough and display different details based on the precision
      if (precision == "hour") {
        // Add launch date
        const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
        let datestring = launchDateTime.toLocaleDateString(undefined, dateOptions);
        addDateText(stack, datestring);
    
        // Add launch time
        const timeOptions = { hour: "numeric", minute: "numeric" };
        let timestring = launchDateTime.toLocaleTimeString(undefined, timeOptions);
        addDateText(stack, timestring);
      } else if (precision == "day") {
        // Add launch date
        const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
        let datestring = launchDateTime.toLocaleDateString(undefined, dateOptions);
        addDateText(stack, datestring);
      } else {
        addDateText(stack, "No day for next launch given");
      }
    }
    
    function addDateText(stack, text) {
      let dateText = stack.addText(text);
      dateText.centerAlignText();
      dateText.font = Font.semiboldSystemFont(20);
      dateText.textColor = new Color("#ffffff");
    }