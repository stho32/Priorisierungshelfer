function roundResult(resultValue) {
    return Math.round(resultValue*100)/100;
}


function AppViewModel() {
    var model = {};

    model.ziele = [
        { name: "Hauptziel", punkte: 2, istAusgewaehlt: ko.observable(false) },
        { name: "Nebenziel", punkte: 1, istAusgewaehlt: ko.observable(false) }
    ];

    model.spart = {
        Minuten: { Anzahl: ko.observable(0), PunkteProStueck: 0.01 },
        Euro: { Anzahl: ko.observable(0), PunkteProStueck: 0.01 },
    }

    model.Skalierung = {
        NutzungenProJahr: ko.observable(0),
        AnzahlMitarbeiter: ko.observable(0)
    }

    model.ZieltreueGesamt = ko.observable(0);

    model.ZieltreueGesamtFn = function() {
        var zieltreue = 0;
        for (var i = 0; i < model.ziele.length; i++) {
            if (model.ziele[i].istAusgewaehlt()) {
                zieltreue += model.ziele[i].punkte;
            }
        }
        model.ZieltreueGesamt(zieltreue);
    };

    function ZieltreueUeberwachen() {
        for (var i = 0; i < model.ziele.length; i++) {
            model.ziele[i].istAusgewaehlt.subscribe(model.ZieltreueGesamtFn);
        }
    }
    ZieltreueUeberwachen();

    model.ErsparnisGesamt = ko.pureComputed(function() {
        return roundResult(model.spart.Minuten.Anzahl() * model.spart.Minuten.PunkteProStueck + model.spart.Euro.Anzahl() * model.spart.Euro.PunkteProStueck);
    });

    model.SkalierungGesamt = ko.pureComputed(function() {
        return roundResult(model.Skalierung.AnzahlMitarbeiter() * model.Skalierung.NutzungenProJahr());
    });

    model.PunkteGesamt = ko.pureComputed(function () {
        return roundResult(model.ZieltreueGesamt() * model.ErsparnisGesamt() * model.SkalierungGesamt());
    });

    return model;
}

ko.applyBindings(AppViewModel());
