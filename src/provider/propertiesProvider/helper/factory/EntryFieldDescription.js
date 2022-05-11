'use strict';

const domify = require('min-dom').domify,
    domClasses = require('min-dom').classes,
    domEvent = require('min-dom').event;

const escapeHTML = require('bpmn-js-properties-panel/lib/Utils').escapeHTML;

const MAX_DESCRIPTION_LENGTH = 200;

module.exports = function entryFieldDescription(translate, description, options) {
    const show = options && options.show;

    // we tokenize the description to extract text, HTML and markdown links
    // text, links and new lines are handled seperately

    const escaped = [], shortened = [];

    // match markdown [{TEXT}]({URL}) and HTML links <a href="{URL}">{TEXT}</a>
    const pattern = /(?:\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(?:<a href="(https?:\/\/[^"]+)">(.+?(?=<\/))<\/a>)/gi;

    let index = 0;
    let match;
    let link, text;
    let visibleTextLength = 0;

    while ((match = pattern.exec(description))) {

        // escape + insert text before match
        if (match.index > index) {
            const t = escapeText(description.substring(index, match.index));
            shortened.push(t.substring(0, MAX_DESCRIPTION_LENGTH - visibleTextLength));
            visibleTextLength += shortened[shortened.length - 1].length;
            escaped.push(t);
        }

        link = match[2] && encodeURI(match[2]) || match[3];
        text = match[1] || match[4];

        // insert safe link
        const t = escapeText(text);
        shortened.push('<a href="' + link + '" target="_blank">' + t.substring(0, MAX_DESCRIPTION_LENGTH - visibleTextLength) + '</a>');
        visibleTextLength += shortened[shortened.length - 1].length;
        escaped.push('<a href="' + link + '" target="_blank">' + escapeText(text) + '</a>');

        index = match.index + match[0].length;
    }

    // escape and insert text after last match
    if (index < description.length) {
        const t = escapeText(description.substring(index));
        shortened.push(t.substring(0, MAX_DESCRIPTION_LENGTH - visibleTextLength));
        visibleTextLength += shortened[shortened.length - 1].length;
        escaped.push(t);
    }

    const html = domify(
        '<div class="bpp-field-description description description--expanded"' +
        (show ? 'data-show="' + show + '">' : '>') +
        '</div>'
    );

    const descriptionText = domify('<span class="description__text">' + escaped.join('') + '</span>');
    const shortenedDescriptionText = domify('<span class="description__text">' + shortened.join('') + ' ...</span>');

    html.appendChild(descriptionText);

    function toggleExpanded(expanded) {
        if (expanded) {
            domClasses(html).add('description--expanded');

            html.replaceChild(descriptionText, shortenedDescriptionText);

            expand.textContent = translate('Less');
        } else {
            domClasses(html).remove('description--expanded');

            html.replaceChild(shortenedDescriptionText, descriptionText);

            expand.textContent = translate('More');
        }
    }

    let expand,
        expanded = false;

    if (visibleTextLength > MAX_DESCRIPTION_LENGTH) {

        expand = domify(
            '<span class="bpp-entry-link description__expand">' +
            translate('More') +
            '</span>'
        );

        domEvent.bind(expand, 'click', function () {
            expanded = !expanded;

            toggleExpanded(expanded);
        });

        html.appendChild(expand);

        toggleExpanded(expanded);
    }

    return html;
};

function escapeText(text) {
    let match, index = 0, escaped = [];

    // match new line <br/> <br /> <br.... /> etc.
    const pattern = /<br\s*\/?>/gi;

    while ((match = pattern.exec(text))) {

        if (match.index > index) {
            escaped.push(escapeHTML(text.substring(index, match.index)));
        }

        escaped.push('<br />');

        index = match.index + match[0].length;
    }

    if (index < text.length) {
        escaped.push(escapeHTML(text.substring(index)));
    }

    return escaped.join('');
}