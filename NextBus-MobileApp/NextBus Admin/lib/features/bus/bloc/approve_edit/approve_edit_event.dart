part of 'approve_edit_bloc.dart';

abstract class ApproveEditEvent extends Equatable {
  const ApproveEditEvent();

  @override
  List<Object?> get props => [];
}

class ApproveEdit extends ApproveEditEvent {
  final String id;

  const ApproveEdit({required this.id});

  @override
  List<Object?> get props => [id];
}