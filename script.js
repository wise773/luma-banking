(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var navigation = document.querySelector("#primary-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  var balanceButton = document.querySelector(".balance-toggle");
  if (balanceButton) {
    balanceButton.addEventListener("click", function (event) {
      var button = event.currentTarget;
      var amount = document.querySelector(".balance-amount");
      var isHidden = button.getAttribute("aria-pressed") !== "true";
      amount.textContent = isHidden ? "••••••••" : amount.getAttribute("data-visible");
      button.setAttribute("aria-pressed", String(isHidden));
      button.setAttribute("aria-label", isHidden ? "Show account balance" : "Hide account balance");
    });
  }

  var chartData = {
    week: {
      values: [70, 62, 67, 51, 55, 33, 38],
      labels: ["6D AGO", "5D", "4D", "3D", "2D", "YDAY", "TODAY"],
      title: "Example cash-flow prompt",
      copy: "A reminder before recurring bills could help you plan.",
      description: "Sample weekly balance trend. No account is connected and these figures are not real."
    },
    month: {
      values: [78, 70, 73, 56, 61, 43, 38],
      labels: ["START", "5D", "10D", "15D", "20D", "25D", "END"],
      title: "Example monthly view",
      copy: "A future service could summarize recurring spending with your permission.",
      description: "Sample monthly balance trend. No account is connected and these figures are not real."
    },
    year: {
      values: [85, 79, 69, 73, 57, 48, 38],
      labels: ["JAN", "MAR", "MAY", "JUL", "SEP", "NOV", "DEC"],
      title: "Example longer-term view",
      copy: "A future service could help compare progress with a goal you choose.",
      description: "Sample yearly balance trend. No account is connected and these figures are not real."
    }
  };

  var chartLine = document.querySelector("#chart-line");
  if (chartLine) {
    var chartArea = document.querySelector("#chart-area");
    var chart = document.querySelector(".chart");
    var chartDescription = document.querySelector("#chart-description");
    var chartLabels = document.querySelectorAll(".chart-label span");
    var insightTitle = document.querySelector("#insight-title");
    var insightCopy = document.querySelector("#insight-copy");

    document.querySelectorAll(".balance-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var data = chartData[tab.getAttribute("data-period")];
        if (!data) {
          return;
        }

        var linePath = data.values.map(function (value, index) {
          return (index === 0 ? "M" : "L") + (index * 60) + " " + value;
        }).join(" ");

        chartLine.setAttribute("d", linePath);
        chartArea.setAttribute("d", linePath + " L360 92 L0 92Z");
        chart.setAttribute("aria-label", data.description);
        chartDescription.textContent = data.description;
        insightTitle.textContent = data.title;
        insightCopy.textContent = data.copy;
        data.labels.forEach(function (label, index) {
          chartLabels[index].textContent = label;
        });

        document.querySelectorAll(".balance-tab").forEach(function (periodTab) {
          var isSelected = periodTab === tab;
          periodTab.classList.toggle("active", isSelected);
          periodTab.setAttribute("aria-pressed", String(isSelected));
        });
      });
    });
  }

  function openDialog(dialog) {
    if (dialog && !dialog.open) {
      if (dialog.id === "walkthrough") {
        var formStatus = dialog.querySelector(".form-status");
        if (formStatus) {
          formStatus.textContent = "";
        }
      }
      dialog.showModal();
    }
  }

  document.addEventListener("click", function (event) {
    var dialogLink = event.target.closest('a[href="#sign-in"], a[href="#walkthrough"]');
    if (dialogLink) {
      var dialog = document.querySelector(dialogLink.getAttribute("href"));
      if (dialog) {
        event.preventDefault();
        openDialog(dialog);
      }
    }

    if (event.target.closest("[data-dialog-close]")) {
      var openDialogElement = document.querySelector(".site-dialog[open]");
      if (openDialogElement) {
        openDialogElement.close();
      }
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      var openDialogElement = document.querySelector(".site-dialog[open]");
      if (openDialogElement) {
        event.preventDefault();
        openDialogElement.close();
      }
    }
  }, true);

  var linkedDialog = window.location.hash === "#sign-in"
    ? document.getElementById("sign-in")
    : window.location.hash === "#walkthrough"
      ? document.getElementById("walkthrough")
      : null;
  if (linkedDialog) {
    openDialog(linkedDialog);
  }

  document.querySelectorAll(".site-dialog").forEach(function (dialog) {
    dialog.addEventListener("close", function () {
      if (window.location.hash === "#" + dialog.id) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    });
  });

  var walkthroughForm = document.querySelector("#walkthrough-form");
  if (walkthroughForm) {
    walkthroughForm.addEventListener("submit", function (event) {
      event.preventDefault();
      walkthroughForm.reset();
      document.querySelector(".form-status").textContent =
        "Preview complete. This concept does not send or store requests; a secure contact service must be connected before launch.";
    });
  }
}());
