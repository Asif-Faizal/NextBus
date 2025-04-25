import 'package:flutter_bloc/flutter_bloc.dart';

class DateState {
  final DateTime selectedDate;
  final String formattedDate;

  DateState({
    required this.selectedDate,
    required this.formattedDate,
  });
}

class DateCubit extends Cubit<DateState> {
  DateCubit() : super(DateState(
    selectedDate: DateTime.now(),
    formattedDate: _formatDate(DateTime.now()),
  ));

  void updateDate(DateTime date) {
    emit(DateState(
      selectedDate: date,
      formattedDate: _formatDate(date),
    ));
  }

  static String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')} '
           '${date.hour.toString().padLeft(2, '0')}:'
           '${date.minute.toString().padLeft(2, '0')}';
  }
} 