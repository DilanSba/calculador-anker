// @ts-ignore
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

export interface CotizacionPDFProps {
  cartItems: Array<{ id: string; name: string; qty: number; unitPrice: number; }>;
  priceMode: 'cash' | 'sync';
  syncTerm: '12' | '24' | '48';
  downPayment: number;
  totalFinanced: number;
  monthlyPayment: number;
  totalCash: number;
  consultor: { nombre: string; correo: string; telefono: string; };
  cliente: { nombre: string; correo: string; telefono: string; direccion: string; };
}

const BLUE = '#00AEEF';
const BG = '#0A1628';
const ROW_ODD = '#0D1F38';
const ROW_EVEN = '#0A1628';
const TEXT_MAIN = '#FFFFFF';
const TEXT_SEC = '#A0AEC0';

const styles = StyleSheet.create({
  page: {
    backgroundColor: BG,
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: TEXT_MAIN,
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logo: {
    height: 50,
    objectFit: 'contain',
  },
  ankerTitle: {
    color: BLUE,
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 4,
  },
  divider: {
    height: 2,
    backgroundColor: BLUE,
    marginBottom: 8,
  },
  cotizacionTitle: {
    color: TEXT_MAIN,
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  cotizacionSubtitle: {
    color: TEXT_SEC,
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 1,
  },
  // Data block
  dataBlock: {
    flexDirection: 'row',
    backgroundColor: ROW_ODD,
    borderRadius: 4,
    padding: 10,
    marginBottom: 14,
    gap: 10,
  },
  dataCol: {
    flex: 1,
  },
  dataColHeader: {
    color: BLUE,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  dataLabel: {
    color: TEXT_SEC,
    fontSize: 7,
    width: 60,
    flexShrink: 0,
  },
  dataValue: {
    color: TEXT_MAIN,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },
  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BLUE,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 3,
    marginBottom: 1,
  },
  tableHeaderCell: {
    color: TEXT_MAIN,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  tableCell: {
    color: TEXT_MAIN,
    fontSize: 8,
  },
  colProduct: { width: '45%' },
  colUnitPrice: { width: '20%' },
  colQty: { width: '10%', textAlign: 'center' },
  colTotal: { width: '25%', textAlign: 'right' },
  // Totals
  totalsWrapper: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 14,
  },
  totalsBox: {
    width: '55%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  totalLabel: {
    color: TEXT_SEC,
    fontSize: 8,
  },
  totalValue: {
    color: TEXT_MAIN,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  totalHighlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: BLUE,
  },
  totalHighlightLabel: {
    color: TEXT_MAIN,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  totalHighlightValue: {
    color: TEXT_MAIN,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  // Disclaimer
  disclaimer: {
    color: TEXT_SEC,
    fontSize: 7,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    backgroundColor: BLUE,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  footerText: {
    color: TEXT_MAIN,
    fontSize: 8,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
});

const fmt = (n: number) => '$' + n.toFixed(2);

export default function CotizacionPDF(props: CotizacionPDFProps) {
  const {
    cartItems,
    priceMode,
    syncTerm,
    downPayment,
    totalFinanced,
    monthlyPayment,
    totalCash,
    consultor,
    cliente,
  } = props;

  const cotizacionNum = 'WH-' + Date.now();
  const fechaStr = new Date().toLocaleDateString('es-PR');

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Image
            src="https://i.postimg.cc/44pJ0vXw/logo.png"
            style={styles.logo}
          />
          <Text style={styles.ankerTitle}>ANKER</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.cotizacionTitle}>COTIZACIÓN FORMAL</Text>
        <Text style={styles.cotizacionSubtitle}>BATERÍAS PORTÁTILES · WINDMAR HOME</Text>

        {/* DATA BLOCK */}
        <View style={styles.dataBlock}>
          {/* LEFT: Consultor */}
          <View style={styles.dataCol}>
            <Text style={styles.dataColHeader}>CONSULTOR</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nombre:</Text>
              <Text style={styles.dataValue}>{consultor.nombre}</Text>
            </View>
            {consultor.correo ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Correo:</Text>
                <Text style={styles.dataValue}>{consultor.correo}</Text>
              </View>
            ) : null}
            {consultor.telefono ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Teléfono:</Text>
                <Text style={styles.dataValue}>{consultor.telefono}</Text>
              </View>
            ) : null}
            <View style={{ marginTop: 8 }}>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>N° Cotización:</Text>
                <Text style={styles.dataValue}>{cotizacionNum}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Fecha:</Text>
                <Text style={styles.dataValue}>{fechaStr}</Text>
              </View>
            </View>
          </View>

          {/* RIGHT: Cliente */}
          <View style={styles.dataCol}>
            <Text style={styles.dataColHeader}>CLIENTE</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nombre:</Text>
              <Text style={styles.dataValue}>{cliente.nombre}</Text>
            </View>
            {cliente.correo ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Correo:</Text>
                <Text style={styles.dataValue}>{cliente.correo}</Text>
              </View>
            ) : null}
            {cliente.telefono ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Teléfono:</Text>
                <Text style={styles.dataValue}>{cliente.telefono}</Text>
              </View>
            ) : null}
            {cliente.direccion ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Dirección:</Text>
                <Text style={styles.dataValue}>{cliente.direccion}</Text>
              </View>
            ) : null}
            <View style={{ marginTop: 8 }}>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Validez:</Text>
                <Text style={styles.dataValue}>30 días</Text>
              </View>
            </View>
          </View>
        </View>

        {/* PRODUCTS TABLE */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colProduct]}>PRODUCTO</Text>
          <Text style={[styles.tableHeaderCell, styles.colUnitPrice]}>PRECIO UNIT</Text>
          <Text style={[styles.tableHeaderCell, styles.colQty]}>CANT</Text>
          <Text style={[styles.tableHeaderCell, styles.colTotal]}>TOTAL</Text>
        </View>

        {cartItems.map((item, idx) => {
          const rowBg = idx % 2 === 0 ? ROW_ODD : ROW_EVEN;
          const unitDisplay =
            priceMode === 'sync'
              ? fmt(item.unitPrice) + '/mes'
              : fmt(item.unitPrice);
          const lineTotal = item.unitPrice * item.qty;

          return (
            <View
              key={item.id}
              style={[styles.tableRow, { backgroundColor: rowBg }]}
            >
              <Text style={[styles.tableCell, styles.colProduct]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.colUnitPrice]}>{unitDisplay}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.qty}</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>
                {priceMode === 'sync'
                  ? fmt(lineTotal) + '/mes'
                  : fmt(lineTotal)}
              </Text>
            </View>
          );
        })}

        {/* TOTALS */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totalsBox}>
            {priceMode === 'cash' ? (
              <View style={styles.totalHighlightRow}>
                <Text style={styles.totalHighlightLabel}>TOTAL CASH</Text>
                <Text style={styles.totalHighlightValue}>{fmt(totalCash)}</Text>
              </View>
            ) : (
              <>
                <View style={[styles.totalRow, { backgroundColor: ROW_ODD }]}>
                  <Text style={styles.totalLabel}>TOTAL FINANCIADO</Text>
                  <Text style={styles.totalValue}>{fmt(totalCash)}</Text>
                </View>
                {downPayment > 0 && (
                  <>
                    <View style={[styles.totalRow, { backgroundColor: ROW_EVEN }]}>
                      <Text style={styles.totalLabel}>DOWN PAYMENT</Text>
                      <Text style={styles.totalValue}>{fmt(downPayment)}</Text>
                    </View>
                    <View style={[styles.totalRow, { backgroundColor: ROW_ODD }]}>
                      <Text style={styles.totalLabel}>BALANCE A FINANCIAR</Text>
                      <Text style={styles.totalValue}>{fmt(totalFinanced)}</Text>
                    </View>
                  </>
                )}
                <View style={styles.totalHighlightRow}>
                  <Text style={styles.totalHighlightLabel}>
                    {'CUOTA MENSUAL (' + syncTerm + 'm)'}
                  </Text>
                  <Text style={styles.totalHighlightValue}>{fmt(monthlyPayment) + '/mes'}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* DISCLAIMER */}
        <Text style={styles.disclaimer}>
          Precios referenciales. Financiamiento sujeto a aprobación de Synchrony Financial.{'\n'}
          Windmar Home — Distribuidor Exclusivo Anker en Puerto Rico y El Caribe.
        </Text>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            787.395.7766  |  windmar.com  |  ventas@windmarhome.com  |  © Windmar Home 2025
          </Text>
        </View>
      </Page>
    </Document>
  );
}
