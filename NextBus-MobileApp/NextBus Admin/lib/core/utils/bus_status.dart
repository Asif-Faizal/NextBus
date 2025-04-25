import 'package:flutter/material.dart';

enum BusStatusIdentifier {
  waitingForApproval(1),
  approved(2),
  waitingForEdit(3),
  waitingForDelete(4);

  final int value;
  const BusStatusIdentifier(this.value);

  // Helper method to get the label
  String get label {
    switch (this) {
      case BusStatusIdentifier.waitingForApproval:
        return 'Waiting for Approval';
      case BusStatusIdentifier.approved:
        return 'Approved';
      case BusStatusIdentifier.waitingForEdit:
        return 'Waiting for Edit';
      case BusStatusIdentifier.waitingForDelete:
        return 'Waiting for Delete';
    }
  }

  // Optional: Helper method to get enum from int
  static BusStatusIdentifier? fromValue(int value) {
    return BusStatusIdentifier.values
        .firstWhere((e) => e.value == value, orElse: () => BusStatusIdentifier.waitingForApproval);
  }
}

Color getStatusColor(int status) {
  switch (BusStatusIdentifier.fromValue(status)) {
    case BusStatusIdentifier.waitingForApproval:
      return Colors.orange;
    case BusStatusIdentifier.approved:
      return Colors.green;
    case BusStatusIdentifier.waitingForEdit:
      return Colors.blue;
    case BusStatusIdentifier.waitingForDelete:
      return Colors.red;
    default:
      return Colors.grey;
  }
}
