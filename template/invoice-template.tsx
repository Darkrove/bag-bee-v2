import React, { Fragment } from "react";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
  Font
} from "@react-pdf/renderer";
import { addDays, format, parseISO } from "date-fns";
import { Props } from "@/components/invoice/invoice-layout";
import { InvoiceItem } from "@prisma/client";

interface Item {
  code: string;
  productCategory: string;
  note?: string;
  quantity: string;
  price: string;
  amount: string;
  profit: string;
  dealerCode: string;
}

interface InvoiceProps {
  invoice: Props["invoice"];
  invoiceItem: Props["invoiceItem"];
  totalSales: number;
  me: {
    name: string;
    address: React.ReactNode;
    city: string;
    mail: string;
    contact: string;
  };
}

const InvoiceTemplate = ({ invoice, invoiceItem, totalSales, me }: InvoiceProps) => {
  console.log(invoice);
  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
      lineHeight: 1.5,
      flexDirection: "column",
      borderTopWidth: 8,
      borderColor: "#8a79ab",
    },

    spaceBetween: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      color: "#3E3E3E",
    },

    titleContainer: { flexDirection: "row", marginTop: 10, color: "#3E3E3E" },

    logo: { width: 20 },

    reportTitle: { fontSize: 16, textAlign: "center" },

    addressTitle: { fontSize: 11, fontStyle: "bold" },

    invoice: { fontWeight: "bold", fontSize: 20 },

    invoiceNumber: { fontSize: 11, fontWeight: "bold" },

    address: { fontSize: 10 },

    theader: {
      marginTop: 20,
      fontSize: 10,
      fontStyle: "bold",
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      height: 20,
      backgroundColor: "#DEDEDE",
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    total: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1.5,
      borderColor: "whitesmoke",
      borderBottomWidth: 1,
    },

    tbody2: { flex: 2, borderRightWidth: 1 },
  });

  const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Image style={{ width: 30 }} src="/assets/logo.png" />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "semibold",
              color: "#000",
              marginTop: 3,
            }}
          >
            Famous Bag House
          </Text>
          <Text style={{ fontSize: 10, marginTop: 1 }}>+91 9867081170</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between", 
            gap: 5
          }}
        >
          <Text style={{ fontSize: 20 }}>
            Invoice
          </Text>
          <Text style={{ fontSize: 10 }}>#{invoice.id}</Text>
        </View>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.titleContainer}>
      <View
        style={{
          display: "flex",
          width: "100%",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          alignContent: "flex-end",
          textAlign: "right",
        }}
      >
        <Text style={styles.address}>Shop No. 5,</Text>
        <Text style={styles.address}>Ekta Appartment,</Text>
<Text style={styles.address}>Nehru Road,</Text>
        <Text style={styles.address}>Opp. Ration Office,</Text>
        <Text style={styles.address}>Dombivli East-421201</Text>
      </View>
    </View>
  );

  const UserAddress = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View style={{ maxWidth: 200 }}>
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>Bill to </Text>
          <Text style={styles.address}>{invoice.customerName}</Text>
          <Text style={styles.address}>{invoice.customerPhone}</Text>
          <Text style={styles.address}>{invoice.customerAddress}</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "25%",
            gap: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text style={styles.addressTitle}>Invoice Date</Text>
            <Text style={styles.address}>
              {format(invoice.createdAt, "dd/MM/yyyy")}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text style={styles.addressTitle}>Warranty upto</Text>
            {parseInt(invoice.warrantyPeriod) > 0 ? (
              <Text style={styles.address}>
                {format(
                  addDays(invoice.createdAt, parseInt(invoice.warrantyPeriod)),
                  "dd/MM/yyyy"
                )}
              </Text>
            ) : (
              <Text style={styles.address}>No warranty</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const Table = () => (
    <View
      style={{
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginTop: 10,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          borderBottomWidth: 1,
          borderColor: "#e5e7eb",
          paddingBottom: 4,
        }}
      >
        <View style={{ flex: 2 }}>
          <Text
            style={{
              fontSize: 10,
              color: "#6b7280",
              fontWeight: "medium",
              textTransform: "uppercase",
            }}
          >
            Item
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 10,
              color: "#6b7280",
              fontWeight: "medium",
              textTransform: "uppercase",
            }}
          >
            Code
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 10,
              color: "#6b7280",
              fontWeight: "medium",
              textTransform: "uppercase",
            }}
          >
            Rate
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 10,
              color: "#6b7280",
              fontWeight: "medium",
              textTransform: "uppercase",
            }}
          >
            Qty
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 10,
              color: "#6b7280",
              fontWeight: "medium",
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            Total
          </Text>
        </View>
      </View>

      {invoiceItem.map((item: InvoiceItem, index: number) => (
        <View
          key={index}
          style={{
            width: "100%",
            flexDirection: "row",
            paddingTop: 10,
          }}
        >
          <View style={{ display: 'flex', flex: 2, flexDirection: 'row' }}>
            <Text style={{ fontSize: 10, textTransform: 'capitalize' }}>{item.productCategory}</Text>
            {item.note ? (
              <Text style={{ textTransform: "uppercase", fontSize: 10, color: "#6b7280", justifyContent: 'center', alignItems: 'center' }}>{" "}({item.note})</Text>
            ) : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10 }}>{item.code}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10 }}>Rs. {item.price}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10 }}>{item.quantity}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, textAlign: "right" }}>
              Rs. {item.amount}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const Summary = () => {
    return (
      <View style={{ width: "100%", padding: 10, marginTop: 10 }}>
        <View style={{ width: "50%", marginLeft: "auto" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 10, color: "#6b7280" }}>Subtotal:</Text>
            <Text style={{ fontSize: 10 }}>Rs. {totalSales}.00</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 10, color: "#6b7280" }}>GST (18%):</Text>
            <Text style={{ fontSize: 10 }}>Rs. 0.00</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
              paddingTop: 4,
              borderTopWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>Total:</Text>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>
              Rs. {totalSales}.00
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 10, color: "#6b7280" }}>Amount Paid:</Text>
            <Text style={{ fontSize: 10 }}>Rs. {totalSales}.00</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 10, color: "#6b7280" }}>Amount Due:</Text>
            <Text style={{ fontSize: 10 }}>Rs. 0.00</Text>
          </View>
        </View>
      </View>
    );
  };

  const Footer = () => {
    return (
      <View
        style={{
          width: "100%",
          marginTop: 20,
          padding: 10,
          borderTopWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "bold" }}>Thank you!</Text>
          <Text style={{ fontSize: 11 }}>© 2024 Famous Bag</Text>
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "100%",
          }}
        >
          <View>
            {/* Header Section */}
            <InvoiceTitle />
            <Address />
            {/* Customer Details */}
            <UserAddress />

            {/* Items Table */}
            <Table />

            {/* Summary Section */}
            <Summary />
          </View>

          {/* Footer Section */}
          <Footer />
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceTemplate;