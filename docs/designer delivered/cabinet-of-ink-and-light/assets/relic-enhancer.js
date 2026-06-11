var RelicEnhancer;
(function (RelicEnhancer) {
    const cornerKinds = ['sigilBloom', 'vesica', 'roseWindow', 'pilgrimStar'];
    const miniKinds = ['sigilBloom', 'chaplet', 'vesica', 'labyrinth', 'memoryField', 'roseWindow', 'waterClock', 'pilgrimStar'];
    function currentFile() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    }
    function makeLink(href, label) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        if (currentFile() === href)
            a.classList.add('is-current');
        return a;
    }
    function injectNavigation(folio) {
        if (folio.querySelector('.relic-nav'))
            return;
        const nav = document.createElement('nav');
        nav.className = 'relic-nav';
        nav.append(makeLink('index.html', 'Cabinet'), document.createTextNode('·'), makeLink('on-the-unfolding-of-form-plates.html', 'Treatise'), document.createTextNode('·'), makeLink('twelve-movements-for-ink-and-light.html', 'Volume I'), document.createTextNode('·'), makeLink('twelve-more-movements.html', 'Volume II'), document.createTextNode('·'), makeLink('twelve-further-artefacts-for-ink-and-light.html', 'Artefacts'));
        folio.insertBefore(nav, folio.firstChild);
    }
    function injectTitleWhisper(folio) {
        const titleBlock = folio.querySelector('.title-block');
        if (!titleBlock || titleBlock.querySelector('.relic-whisper'))
            return;
        const whisper = document.createElement('div');
        whisper.className = 'relic-whisper';
        whisper.textContent = 'scriptorium of moving forms · remastered study';
        titleBlock.appendChild(whisper);
    }
    function injectFolioCorners(folio) {
        if (folio.querySelector('.relic-folio-corner'))
            return;
        ['nw', 'ne', 'sw', 'se'].forEach((pos, i) => {
            const corner = document.createElement('div');
            corner.className = `relic-folio-corner relic-folio-corner--${pos}`;
            folio.appendChild(corner);
            MovementLibrary.renderMini(cornerKinds[i % cornerKinds.length], corner, 100 + i * 13);
        });
    }
    function injectPlateFrames(folio) {
        const plates = Array.from(folio.querySelectorAll('.plate, .geometric-plate'));
        plates.forEach((plate, index) => {
            var _a;
            plate.classList.add('relic-plate-shell');
            if (!plate.querySelector('.relic-plate-frame')) {
                const frame = document.createElement('div');
                frame.className = 'relic-plate-frame';
                plate.appendChild(frame);
            }
            if (!plate.querySelector('.relic-mini-artefact')) {
                const token = document.createElement('div');
                token.className = `relic-mini-artefact relic-mini-artefact--${index % 2 === 0 ? 'east' : 'west'}`;
                plate.appendChild(token);
                MovementLibrary.renderMini(miniKinds[index % miniKinds.length], token, 400 + index * 29);
            }
            let title = null;
            let cursor = plate.nextElementSibling;
            while (cursor) {
                if (cursor.classList.contains('plate-title') || cursor.classList.contains('plate-caption') || cursor.classList.contains('figure-caption')) {
                    title = cursor;
                    break;
                }
                if (cursor.classList.contains('plate') || cursor.classList.contains('geometric-plate'))
                    break;
                cursor = cursor.nextElementSibling;
            }
            if (title && !((_a = title.nextElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains('relic-title-tail'))) {
                const tail = document.createElement('div');
                tail.className = 'relic-title-tail rv';
                tail.innerHTML = '<span></span><span></span><span></span>';
                title.insertAdjacentElement('afterend', tail);
            }
        });
    }
    function injectMarginSigils(folio) {
        const notes = Array.from(folio.querySelectorAll('.margin-note'));
        notes.forEach((note, index) => {
            if (note.querySelector('.relic-note-sigil'))
                return;
            const sigil = document.createElement('div');
            sigil.className = 'relic-note-sigil';
            note.appendChild(sigil);
            MovementLibrary.renderMini(miniKinds[(index + 2) % miniKinds.length], sigil, 900 + index * 17);
        });
    }
    function observeActiveZones(folio) {
        const plates = Array.from(folio.querySelectorAll('.plate, .geometric-plate, .artefact-plate'));
        if (!plates.length)
            return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const target = entry.target;
                target.classList.toggle('is-active', entry.isIntersecting);
                target.classList.toggle('is-dormant', !entry.isIntersecting);
            });
        }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
        plates.forEach((plate) => {
            plate.classList.add('is-dormant');
            observer.observe(plate);
        });
    }
    function observeReveals(folio) {
        const reveals = Array.from(folio.querySelectorAll('.rv, .reveal'));
        if (!reveals.length)
            return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting)
                    return;
                entry.target.classList.add(entry.target.classList.contains('rv') ? 'vis' : 'visible');
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        reveals.forEach((item) => observer.observe(item));
    }
    function appendColophonSeal(folio) {
        const colophon = folio.querySelector('.colophon');
        if (!colophon || colophon.querySelector('.relic-colophon-seal'))
            return;
        const seal = document.createElement('div');
        seal.className = 'relic-colophon-seal';
        colophon.appendChild(seal);
        MovementLibrary.renderMini('sigilBloom', seal, 2026);
        const note = document.createElement('div');
        note.className = 'relic-colophon-note';
        note.textContent = 'augmented with a living artefact library, shared paper system, and dormant-motion control';
        colophon.appendChild(note);
    }
    function init() {
        document.body.classList.add('relic-enhanced');
        const folio = document.querySelector('.folio');
        if (!folio)
            return;
        injectNavigation(folio);
        injectTitleWhisper(folio);
        injectFolioCorners(folio);
        injectPlateFrames(folio);
        injectMarginSigils(folio);
        appendColophonSeal(folio);
        observeActiveZones(folio);
        observeReveals(folio);
    }
    document.addEventListener('DOMContentLoaded', init);
})(RelicEnhancer || (RelicEnhancer = {}));
window.RelicEnhancer = RelicEnhancer;
