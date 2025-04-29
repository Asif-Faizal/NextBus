part of 'approve_delete_bloc.dart';

abstract class ApproveDeleteEvent extends Equatable {
  const ApproveDeleteEvent();

  @override
  List<Object?> get props => [];
}

class ApproveDelete extends ApproveDeleteEvent {
  final String id;

  const ApproveDelete({required this.id});

  @override
  List<Object?> get props => [id];
}
