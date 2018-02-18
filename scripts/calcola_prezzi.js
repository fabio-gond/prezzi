// JavaScript Document

var costoTotale=0;
var costoCarta=0;
var costoStampa=0;
var costoMateriali=0;
var costoLavorazioni=0; // Costo altre lavorazioni
var hStampa=20; // Altezza della stampa in cm (compresi bordi)
var wStampa=10; // Larghezza della stampa in cm (compresi bordi)
//var areaStampa=hStampa*wStampa/10000; // Area della stampa in m2 (compresi bordi)
var costoOrario=15; // Costo in euro per un ora di lavoro di un lavoratore
var qtaProdotti=100; // Quantità di prodotti finali
var carteDisponibili=[["navigator_a4",29.7,21,0.005],["navigator_a3",42,29.7,0.009]]; // Dimensioni di carta disponibili [larghezza,altezza,costoFoglio]


/*
function carta (tipo, grammatura, width, height, costoFoglio){
	this.name=name;
	this.width=width;
	this.height=height;
	this.costoFoglio=costoFoglio;
}
carte["pat_luc_100_70"]=new carta("pat_lucida",170,70,100,0.005); */



// ---------- Calcolo Costo Carta ------------

// Calcola di quanti fogli ho bisogno
function scegliCarta (){
	"use strict";
	var costoProdotto=1000; // Costo della carta nell'area occupata dal prodotto
	var tipoCarta="";
	carteDisponibili.forEach(function(carta, index){ 
		var costoFoglio= carta[3];
		var hFoglio= carta[1]; // dimensioni della carta in cm
		var wFoglio= carta[2]; // dimensioni della carta in cm
		var dim=0; var dim1=0;
		if (hFoglio>= hStampa && wFoglio>=wStampa){
			dim =Math.floor(hFoglio / hStampa) * Math.floor(wFoglio / wStampa);
		}
		if (hFoglio>= wStampa && wFoglio>=hStampa){
			dim1 =Math.floor(hFoglio / wStampa) * Math.floor(wFoglio / hStampa);
		}
		var costoTemp = costoFoglio/Math.max(dim,dim1);
		tipoCarta= costoTemp<costoProdotto? carta[0]:tipoCarta;
		costoProdotto= costoTemp<costoProdotto? costoTemp : costoProdotto;
	});
	return [tipoCarta,costoProdotto * qtaProdotti];
}

var cartaScelta = scegliCarta();


//--------------------------------------------


// ---------- Calcolo Costo Stampa ------------

// --------------------------------------------

costoTotale=costoCarta+costoLavorazioni+costoMateriali+costoStampa;
