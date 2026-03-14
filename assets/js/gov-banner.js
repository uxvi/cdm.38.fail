(function () {
  const STYLE_ID = "cdm-gov-banner-style";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .gov-banner {
        background: var(--gov-banner-bg, #f8fafc);
        border-bottom: 1px solid var(--gov-banner-border, #d7dee8);
        font-size: 0.95rem;
      }

      .gov-banner summary {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: var(--gov-banner-summary-padding, 4px 16px);
        cursor: pointer;
        list-style: none;
        max-width: var(--gov-banner-max-width, none);
        margin: 0 auto;
      }

      .gov-banner summary::-webkit-details-marker {
        display: none;
      }

      .gov-banner img {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }

      .gov-banner-label {
        font-weight: 600;
      }

      .gov-banner-link {
        margin-left: auto;
        color: #1d4ed8;
        text-decoration: underline;
      }

      .gov-banner-chevron {
        font-size: 0.85rem;
        color: var(--gov-banner-muted, #52606d);
        transition: transform 0.2s ease;
      }

      .gov-banner[open] .gov-banner-chevron {
        transform: rotate(180deg);
      }

      .gov-banner-panel {
        border-top: 1px solid var(--gov-banner-border, #d7dee8);
        background: #fff;
      }

      .gov-banner-grid {
        max-width: var(--gov-banner-max-width, none);
        margin: 0 auto;
        padding: var(--gov-banner-panel-padding, 16px);
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .gov-banner-item {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .gov-banner-icon {
        width: 36px;
        height: 36px;
        border-radius: 999px;
        border: 1px solid var(--gov-banner-icon-border, #b8c8df);
        color: var(--gov-banner-icon-color, #1e4fa8);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
      }

      .gov-banner-item strong {
        display: block;
        margin-bottom: 4px;
      }

      @media (max-width: 760px) {
        .gov-banner summary,
        .gov-banner-grid {
          padding-left: 14px;
          padding-right: 14px;
        }

        .gov-banner summary {
          flex-wrap: wrap;
        }

        .gov-banner-link {
          margin-left: 0;
        }

        .gov-banner-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function insertGovBanner(options) {
    injectStyles();

    const settings = Object.assign({
      favicon: "../assets/img/favicon.ico",
      label: "An official website of the Republic of Cortesia Del Mar",
      linkText: "Here's how you know",
      panelTitleOne: "Cortesian websites use 38.fail",
      panelBodyOne: "A .38.fail website belongs to an official organization belonging to or presiding in the Republic of Cortesia Del Mar.",
      panelTitleTwo: "All Cortesian websites use HTTPS",
      panelBodyTwo: "A lock(🔒) or https:// means you've safely connected to a .38.fail website. Only send sensitive information over official, secure websites.",
      iconOne: "&#9733;",
      iconTwo: "&#127963;&#65039;",
      maxWidth: null,
      summaryPadding: null,
      panelPadding: null,
      mount: document.body,
      before: document.body ? document.body.firstChild : null
    }, options || {});

    const banner = document.createElement("details");
    banner.className = "gov-banner";

    if (settings.maxWidth) {
      banner.style.setProperty("--gov-banner-max-width", settings.maxWidth);
    }
    if (settings.summaryPadding) {
      banner.style.setProperty("--gov-banner-summary-padding", settings.summaryPadding);
    }
    if (settings.panelPadding) {
      banner.style.setProperty("--gov-banner-panel-padding", settings.panelPadding);
    }

    banner.innerHTML = `
      <summary>
        <img src="${settings.favicon}" alt="Cortesian emblem">
        <span class="gov-banner-label">${settings.label}</span>
        <span class="gov-banner-link">${settings.linkText}</span>
        <span class="gov-banner-chevron" aria-hidden="true">&#9650;</span>
      </summary>
      <div class="gov-banner-panel">
        <div class="gov-banner-grid">
          <div class="gov-banner-item">
            <div class="gov-banner-icon" aria-hidden="true">${settings.iconOne}</div>
            <div>
              <strong>${settings.panelTitleOne}</strong>
              ${settings.panelBodyOne}
            </div>
          </div>
          <div class="gov-banner-item">
            <div class="gov-banner-icon" aria-hidden="true">${settings.iconTwo}</div>
            <div>
              <strong>${settings.panelTitleTwo}</strong>
              ${settings.panelBodyTwo}
            </div>
          </div>
        </div>
      </div>
    `;

    settings.mount.insertBefore(banner, settings.before);
    return banner;
  }

  window.insertGovBanner = insertGovBanner;
})();

