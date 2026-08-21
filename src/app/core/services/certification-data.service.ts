import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, distinctUntilChanged } from 'rxjs';
import { CertificationLevel, AuthorizedCenter, CertificationStep } from '../models/certification.model';
import { LanguageService, TranslationKey } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class CertificationDataService {
  constructor(private lang: LanguageService) {}

  private baseLevels: CertificationLevel[] = [
    {
      id: 'foundation',
      title: 'PME Foundation',
      subtitle: 'Fundamentals of Project Management',
      totalFee: 60000,
      registrationFee: 15000,
      examFee: 45000,
      targetPublic: '',
      minimumEducation: '',
      experienceYears: 0,
      prerequisites: [],
      features: [],
      examDetails: {
        durationMinutes: 90,
        questionCount: 100,
        examType: '',
        passingScore: 70
      },
      color: 'blue'
    },
    {
      id: 'practitioner',
      title: 'PME Practitioner',
      subtitle: 'Professional Project Management Practice',
      totalFee: 115000,
      registrationFee: 25000,
      examFee: 90000,
      targetPublic: '',
      minimumEducation: '',
      experienceYears: 2,
      prerequisites: [],
      features: [],
      highlights: [],
      isPopular: true,
      examDetails: {
        durationMinutes: 180,
        questionCount: 150,
        examType: '',
        passingScore: 75
      },
      color: 'green',
      badge: ''
    },
    {
      id: 'professional',
      title: 'PME Professional',
      subtitle: 'Advanced Project Management',
      totalFee: 200000,
      registrationFee: 40000,
      examFee: 160000,
      targetPublic: '',
      minimumEducation: '',
      experienceYears: 5,
      experienceHours: 4500,
      prerequisites: [],
      features: [],
      examDetails: {
        durationMinutes: 240,
        examType: '',
        passingScore: 80
      },
      color: 'orange'
    },
    {
      id: 'master',
      title: 'PME Master',
      subtitle: 'Strategic Project Management Leadership',
      totalFee: 400000,
      registrationFee: 80000,
      examFee: 320000,
      targetPublic: '',
      minimumEducation: '',
      experienceYears: 10,
      experienceHours: 8000,
      prerequisites: [],
      features: [],
      examDetails: {
        durationMinutes: 190,
        examType: '',
        passingScore: 85
      },
      color: 'blue'
    }
  ];

  private baseCenters: AuthorizedCenter[] = [
    {
      id: 'center-douala',
      city: 'Douala',
      location: 'Akwa',
      address: 'Avenue du Roi, Douala - Cameroon',
      phoneNumber: '+237 6 00 00 00 00',
      features: { hasComputerLab: true, hasStableInternet: true, hasCctv: true, seatCapacity: 50 }
    },
    {
      id: 'center-yaounde',
      city: 'Yaoundé',
      location: 'Centre-ville',
      address: 'Rue Foch, Centre-ville, Yaoundé',
      phoneNumber: '+237 6 00 00 00 01',
      features: { hasComputerLab: true, hasStableInternet: true, hasCctv: true, seatCapacity: 40 }
    },
    {
      id: 'center-bafoussam',
      city: 'Bafoussam',
      location: 'Marché A',
      address: 'Marché A, Bafoussam',
      phoneNumber: '+237 6 00 00 00 02',
      features: { hasComputerLab: true, hasStableInternet: true, hasCctv: false, seatCapacity: 30 }
    },
    {
      id: 'center-garoua',
      city: 'Garoua',
      location: 'Roumdé Adjia',
      address: 'Quartier Roumdé Adjia, Garoua',
      phoneNumber: '+237 6 00 00 00 03',
      features: { hasComputerLab: true, hasStableInternet: true, hasCctv: true, seatCapacity: 25 }
    },
    {
      id: 'center-bamenda',
      city: 'Bamenda',
      location: 'Commercial Avenue',
      address: 'Commercial Avenue, Bamenda',
      phoneNumber: '+237 6 00 00 00 04',
      features: { hasComputerLab: true, hasStableInternet: true, hasCctv: true, seatCapacity: 30 }
    },
    {
      id: 'center-maroua',
      city: 'Maroua',
      location: 'Domayo',
      address: 'Quartier Domayo, Maroua',
      phoneNumber: '+237 6 00 00 00 05',
      features: { hasComputerLab: true, hasStableInternet: true, hasCctv: false, seatCapacity: 20 }
    },
    {
      id: 'center-buea',
      city: 'Buea',
      location: 'Molyko',
      address: 'Molyko, Buea',
      phoneNumber: '+237 6 00 00 00 06',
      features: { hasComputerLab: true, hasStableInternet: true, hasCctv: true, seatCapacity: 25 }
    }
  ];

  private buildLevels(t: (k: TranslationKey, vars?: Record<string, string | number>) => string): CertificationLevel[] {
    const buildPrereq = (a: TranslationKey, b: TranslationKey) => [t(a), t(b)];
    const buildFeatures = (f1: TranslationKey, f2: TranslationKey, f3: TranslationKey) => [t(f1), t(f2), t(f3)];

    return this.baseLevels.map(base => {
      const clone: CertificationLevel = JSON.parse(JSON.stringify(base));
      switch (clone.id) {
        case 'foundation':
          clone.targetPublic = t('lvlFoundationTarget');
          clone.minimumEducation = t('lvlFoundationMinEd');
          clone.prerequisites = buildPrereq('lvlPrereqFoundation', 'lvlPrereqFoundation2');
          clone.features = buildFeatures('lvlFoundationFeat1', 'lvlFoundationFeat2', 'lvlFoundationFeat3');
          clone.examDetails.examType = t('lvlExamQcm');
          break;
        case 'practitioner':
          clone.targetPublic = t('lvlPractitionerTarget');
          clone.minimumEducation = t('lvlPractitionerMinEd');
          clone.prerequisites = buildPrereq('lvlPrereqPractitioner', 'lvlPrereqPractitioner2');
          clone.features = buildFeatures('lvlPractitionerFeat1', 'lvlPractitionerFeat2', 'lvlPractitionerFeat3');
          clone.examDetails.examType = t('lvlExamQcm');
          clone.badge = t('lvlPractitionerBadge');
          clone.highlights = [t('lvlPractitionerBadge')];
          break;
        case 'professional':
          clone.targetPublic = t('lvlProfessionalTarget');
          clone.minimumEducation = t('lvlProfessionalMinEd');
          clone.prerequisites = buildPrereq('lvlPrereqProfessional', 'lvlPrereqProfessional2');
          clone.features = buildFeatures('lvlProfessionalFeat1', 'lvlProfessionalFeat2', 'lvlProfessionalFeat3');
          clone.examDetails.examType = t('lvlExamCase');
          break;
        case 'master':
          clone.targetPublic = t('lvlMasterTarget');
          clone.minimumEducation = t('lvlMasterMinEd');
          clone.prerequisites = buildPrereq('lvlPrereqMaster', 'lvlPrereqMaster2');
          clone.features = buildFeatures('lvlMasterFeat1', 'lvlMasterFeat2', 'lvlMasterFeat3');
          clone.examDetails.examType = t('lvlExamThesis');
          break;
      }
      return clone;
    });
  }

  private buildSteps(t: (k: TranslationKey) => string): CertificationStep[] {
    return [
      { id: 1, key: 'submission', title: t('stepSubmission'), description: t('stepSubmissionDesc'), estimatedDuration: t('durImmediate') },
      { id: 2, key: 'review', title: t('stepReview'), description: t('stepReviewDesc'), estimatedDuration: t('dur5days') },
      { id: 3, key: 'validation', title: t('stepPayment'), description: t('stepPaymentDesc'), estimatedDuration: t('durMethod') },
      { id: 4, key: 'convocation', title: t('stepConvocation'), description: t('stepConvocationDesc'), estimatedDuration: t('dur24h') },
      { id: 5, key: 'exam', title: t('stepExam'), description: t('stepExamDesc'), estimatedDuration: t('durLevel') },
      { id: 6, key: 'certificate', title: t('stepCertificate'), description: t('stepCertificateDesc'), estimatedDuration: t('dur7days') }
    ];
  }

  private readonly levels$ = this.lang.combine$(t => this.buildLevels(t)).pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
  private readonly steps$ = this.lang.combine$(t => this.buildSteps(t)).pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
  private readonly centers$ = new BehaviorSubject<AuthorizedCenter[]>(this.baseCenters);

  getCertificationLevels(): Observable<CertificationLevel[]> {
    return this.levels$;
  }

  getCertificationLevelById(id: string): Observable<CertificationLevel | undefined> {
    return this.levels$.pipe(map(list => list.find(l => l.id === id)));
  }

  getAuthorizedCenters(): Observable<AuthorizedCenter[]> {
    return this.centers$.asObservable();
  }

  getCenterById(id: string): Observable<AuthorizedCenter | undefined> {
    return this.centers$.pipe(map(list => list.find(c => c.id === id)));
  }

  getCertificationSteps(): Observable<CertificationStep[]> {
    return this.steps$;
  }

  getStepByKey(key: string): Observable<CertificationStep | undefined> {
    return this.steps$.pipe(map(list => list.find(s => s.key === key)));
  }
}
