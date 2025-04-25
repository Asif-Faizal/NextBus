
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/theme/theme_cubit.dart';
import '../../../core/widgets/gradient_background.dart';
import '../cubit/date_cubit.dart';

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    final isDarkMode = context.watch<ThemeCubit>().state.isDarkMode;
    
    return GradientBackground(
      isDarkMode: isDarkMode,
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Column(
              children: [
                const SizedBox(height: 50),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('NextBus', style: Theme.of(context).textTheme.titleLarge),
                        const SizedBox(height: 16),
                        TextField(
                          decoration: InputDecoration(
                            labelText: 'From',
                            prefixIcon: Icon(
                              Icons.location_on,
                              color: isDarkMode ? Colors.white70 : Colors.black54,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          decoration: InputDecoration(
                            labelText: 'To',
                            prefixIcon: Icon(
                              Icons.location_on,
                              color: isDarkMode ? Colors.white70 : Colors.black54,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          style: TextStyle(color: isDarkMode ? Colors.white : Colors.black),
                          readOnly: true,
                          controller: TextEditingController(
                            text: context.watch<DateCubit>().state.formattedDate,
                          ),
                          decoration: InputDecoration(
                            labelText: 'Select Date and Time',
                            prefixIcon: Icon(
                              Icons.calendar_today,
                              color: isDarkMode ? Colors.white70 : Colors.black54,
                            ),
                          ),
                          onTap: () {
                            showCupertinoModalPopup(
                              context: context,
                              builder: (BuildContext context) {
                                return Container(
                                  height: 300,
                                  color: isDarkMode ? Colors.grey[900] : Colors.white,
                                  child: Column(
                                    children: [
                                      Container(
                                        height: 60,
                                        color: isDarkMode ? Colors.grey[800] : Colors.grey[200],
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            CupertinoButton(
                                              child: const Text('Cancel'),
                                              onPressed: () => Navigator.pop(context),
                                            ),
                                            CupertinoButton(
                                              child: const Text('Done'),
                                              onPressed: () => Navigator.pop(context),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Expanded(
                                        child: CupertinoDatePicker(
                                          mode: CupertinoDatePickerMode.dateAndTime,
                                          initialDateTime: context.read<DateCubit>().state.selectedDate,
                                          onDateTimeChanged: (DateTime newDateTime) {
                                            context.read<DateCubit>().updateDate(newDateTime);
                                          },
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 15),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 5),
                  child: SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {
                      },
                      child: const Text('Search'),
                    ),
                  ),
                ),
              ],
            ),
          ),
          floatingActionButton: FloatingActionButton(
            onPressed: () {
              context.read<ThemeCubit>().toggleTheme();
            },
            child: Icon(isDarkMode ? Icons.light_mode : Icons.dark_mode),
          ),
        ),
      ),
    );
  }
}
